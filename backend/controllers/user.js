const Group = require("../Models/Group");
const User = require("../Models/User");
const Sent = require("../Models/Sent");
const Template = require("../Models/Template");
const bcrypt = require("bcrypt");
const { sendMail } = require("../services/mail");
const generateToken = require("../utils/generateToken");

const addGroup = async (req, res) => {
  try {
    // Validate input
    if (!req.body.name) {
      return res.status(400).send({ 
        success: false, 
        message: "Group name is required" 
      });
    }

    // Validate emails
    if (!req.body.emails || !Array.isArray(req.body.emails)) {
      return res.status(400).send({ 
        success: false, 
        message: "Invalid email data" 
      });
    }

    // Sanitize and validate email data
    const sanitizedEmails = req.body.emails.map(emailObj => ({
      email: emailObj.email.trim().toLowerCase(), // Trim and lowercase email
      name: emailObj.name ? emailObj.name.trim() : '' // Handle optional name
    })).filter(emailObj => {
      // Optional: Additional email validation if needed
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailObj.email);
    });

    // Create new group
    const group = new Group({
      name: req.body.name.trim(),
      emails: sanitizedEmails,
      userId: req.user._id,
    });

    // Save group
    const result = await group.save();

    // Respond with success
    res.status(200).send({ 
      success: true, 
      message: "Successfully added the group",
      group: {
        _id: result._id,
        name: result.name,
        emailCount: result.emails.length
      }
    });
  } catch (error) {
    console.error('Error adding group:', error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).send({ 
        success: false, 
        message: "Validation error",
        details: error.errors 
      });
    }

    // Generic error response
    res.status(500).send({ 
      success: false, 
      message: "Failed to add group",
      error: error.message 
    });
  }
};

const viewGroups = async (req, res) => {
  const groups = await Group.find({ userId: req.user._id });
  if (!groups)
    return res.status(500).send({ success: false, message: "No groups found" });
  res
    .status(200)
    .send({ success: true, message: "successfully fetched the data.", groups });
};

const sendMails = async (req, res) => {
  try {
    const group = await Group.findById(req.body.group);
    if (!group)
      return res.status(404).send({ success: false, message: "Group not found" });
    
    const emails = group.emails.slice(0, 25); // Limit to 25 emails
    if (emails.length === 0)
      return res.status(400).send({ success: false, message: "No emails to send" });
    
    const temp = req.body.template !== "none" ? await Template.findById(req.body.template) : null;
    const message = req.body.message || " ";
    const template = temp ? temp.name : message;
    const subject = req.body.subject;
    
    // Create a new Sent record
    const sent = new Sent({
      userId: req.user._id,
      groupId: req.body.group,
      subject: subject,
      message: template
    });
    await sent.save();
    
    let index = 0;
    const sentEmails = [];
    
    const intervalId = setInterval(async () => {
      if (index >= emails.length) {
        clearInterval(intervalId);
        console.log("All emails sent successfully");
        return res.status(200).send({
           success: true,
           message: "Emails sent successfully",
           sentId: sent._id
        });
      }
      
      const currentEmailObj = emails[index];


      const email = currentEmailObj.email;
      const recipientName = currentEmailObj.name || 'Valued Customer';
      
      // Dynamically replace template placeholders
      let personalizedTemplate = template
        .replace(/{{Recipient Name}}/g, recipientName)
        .replace(/{{Company Name}}/g, req.body.companyName || 'PlutoWebsites')
        .replace(/{{Year}}/g, new Date().getFullYear().toString());
      
      console.log(`Sending email to: ${email}`);
      
      try {
        await sendMail(
          [email], 
          subject, 
          personalizedTemplate, 
          personalizedTemplate
        );
        
        sentEmails.push({
          email: email,
          name: recipientName,
          status: 'sent'
        });
        
        index++;
      } catch (emailError) {
        console.error(`Error sending email to ${email}:`, emailError);
        
        sentEmails.push({
          email: email,
          name: recipientName,
          status: 'failed'
        });
      }
      
      // Optional: Update Sent record with detailed email status
      await Sent.findByIdAndUpdate(sent._id, {
        $set: { sentEmails: sentEmails }
      });
    }, 5000); // 5-second interval
  } catch (error) {
    console.error("Error while sending emails:", error);
    res.status(500).send({ success: false, message: "Failed to send emails" });
  }
};


async function getRecipientNameByEmail(email) {
  try {
    // This is a placeholder - you'll need to replace with actual CSV data retrieval logic
    // For example, using a database or CSV parsing library
    const recipient = await Recipient.findOne({ email: email });
    return recipient ? recipient.name : 'Valued Customer';
  } catch (error) {
    console.error('Error retrieving recipient name:', error);
    return 'Valued Customer';
  }
}

const deleteGroup = async (req, res) => {
  const group = await Group.findByIdAndDelete(req.params.id);
  if (!group)
    return res
      .status(404)
      .send({ success: false, message: "Failed to delete the group" });
  res
    .status(200)
    .send({ success: true, message: "Group deleted successfully" });
};

const register = async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: "Registration failed!" });
  const result = await user.save();
  if (!result)
    return res
      .status(500)
      .send({ success: false, message: "Registration failed!" });
  res.status(200).send({ success: true, message: "Registration successfull" });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: "Incorrect password or email" });
  if (!bcrypt.compareSync(req.body.password, user.password))
    return res
      .status(400)
      .send({ success: false, message: "Invalid username or password" });
  const token = generateToken(user.email);
  res.status(200).send({
    success: true,
    message: "Successfully loggedIn",
    token,
  });
};

const sentDetails = async (req, res) => {
  const mails = await Sent.find({ userId: req.user._id }).populate({
    path: "groupId",
    select: "name",
  });

  if (!mails)
    return res.status(404).send({ success: false, message: "Mails not found" });
  res.send({ success: true, message: "Successfully fetched the data", mails });
};

const newTemplate = async (req, res) => {
  const template = new Template({
    userId: req.user._id,
    content: req.body.content,
    name: req.body.name,
  });
  if (!template)
    return res
      .status(500)
      .send({ success: false, message: "Failed creation of template" });
  const result = await template.save();
  if (!result)
    return res
      .status(500)
      .send({ success: false, message: "Failed creation of template" });
  res
    .status(200)
    .send({ success: true, message: "successfully added new template" });
};

const deleteTemplate = async (req, res) => {
  const template = await Template.findByIdAndDelete(req.params.id);
  if (!template)
    return res
      .status(404)
      .send({ success: false, message: "Template not found!" });
  res
    .status(200)
    .send({ success: true, message: "Template successfully deleted" });
};

const viewTemplates = async (req, res) => {
  const templates = await Template.find({ userId: req.user._id });
  if (!templates)
    return res
      .status(500)
      .send({ success: false, message: "Cannot fetch the templates!" });
  res.status(200).send({
    success: true,
    message: "Templates fetched successfully",
    templates,
  });
};

const dashboard = async (req, res) => {
  const groups = await Group.find({ userId: req.user._id });
  const templates = await Template.find({ userId: req.user._id });
  const sents = await Sent.find({ userId: req.user._id });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    groups: groups.length,
    templates: templates.length,
    sents: sents.length,
  });
};

module.exports = {
  addGroup,
  sendMails,
  viewGroups,
  deleteGroup,
  register,
  login,
  sentDetails,
  newTemplate,
  deleteTemplate,
  viewTemplates,
  dashboard,
};
