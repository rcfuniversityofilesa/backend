const admin = require('../models/admin.model')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const generateSerial = require('../utils/generateSerialNumber')
const cloudinary = require('../config/cloudinary')
const usersMessageModel = require('../models/usersMessage.model')
const adminReply = require('../models/adminReply.model')

const passkey = process.env.pass
const churchEmail = process.env.church_Email;
const JWTKey = process.env.JWT_KEY
const saltRounds = 10

exports.adminregister = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password } = req.body

        const existing = await admin.findOne({ email })
        if (existing) {
            return res.status(400).send('Email already exist')
        }

        const hashed = await bcrypt.hash(password, saltRounds)

        const serialNumber = await generateSerial('admin')

        const newAdmin = new admin({
            firstName,
            middleName,
            lastName,
            email,
            password: hashed,
            serialNumber: serialNumber
        })

        await newAdmin.save()

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: churchEmail,
                pass: passkey
            }
        })

        let mailMessage = {
            from: churchEmail,
            to: email,
            subject: 'Welcome! Your RCF University of Ilesa Admin Account Has Been Created Successfully',
            html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .email-container {
                                background-color: #ffffff;
                                max-width: 600px;
                                margin: 20px auto;
                                border-radius: 8px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                overflow: hidden;
                            }
                            .header {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                padding: 30px 20px;
                                text-align: center;

                            }
                            .header h1 {
                                margin: 0;
                                font-size: 28px;
                                font-weight: 600;
                            }
                            .header p {
                                margin: 5px 0 0 0;
                                font-size: 14px;
                                opacity: 0.9;
                            }
                            .content {
                                padding: 30px 20px;
                            }
                            .welcome-message {
                                font-size: 18px;
                                color: #333;
                                margin-bottom: 20px;
                                font-weight: 500;
                            }
                            .info-box {
                                background-color: #f8f9fa;
                                border-left: 4px solid #667eea;
                                padding: 15px;
                                margin: 15px 0;
                                border-radius: 4px;
                            }
                            .info-box h3 {
                                margin: 0 0 10px 0;
                                color: #667eea;
                                font-size: 14px;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            }
                            .info-box p {
                                margin: 5px 0;
                                color: #555;
                                font-size: 14px;
                                line-height: 1.6;
                            }
                            .admin-details {
                                background-color: #e8eef7;
                                padding: 20px;
                                border-radius: 6px;
                                margin: 20px 0;
                            }
                            .admin-details p {
                                margin: 8px 0;
                                color: #333;
                                font-size: 14px;
                            }
                            .admin-details strong {
                                color: #667eea;
                            }
                            .features-list {
                                margin: 20px 0;
                            }
                            .features-list li {
                                margin: 10px 0;
                                color: #555;
                                font-size: 14px;
                                line-height: 1.6;
                            }
                            .next-steps {
                                background-color: #f0f7ff;
                                border: 1px solid #d0e8ff;
                                padding: 20px;
                                border-radius: 6px;
                                margin: 20px 0;
                            }
                            .next-steps h3 {
                                color: #667eea;
                                margin-top: 0;
                                font-size: 16px;
                            }
                            .next-steps ol {
                                margin: 10px 0;
                                padding-left: 20px;
                                color: #555;
                                font-size: 14px;
                            }
                            .next-steps li {
                                margin: 8px 0;
                                line-height: 1.6;
                            }
                            .cta-button {
                                display: inline-block;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                padding: 12px 30px;
                                text-decoration: none;
                                color: white !important;
                                border-radius: 5px;
                                margin: 20px 0;
                                font-weight: 600;
                                text-align: center;
                            }
                            .footer {
                                background-color: #f8f9fa;
                                padding: 20px;
                                text-align: center;
                                border-top: 1px solid #ddd;
                                font-size: 12px;
                                color: #777;
                            }
                            .footer p {
                                margin: 5px 0;
                            }
                            .success-badge {
                                display: inline-block;
                                background-color: #4caf50;
                                color: white;
                                padding: 8px 15px;
                                border-radius: 20px;
                                font-size: 12px;
                                font-weight: 600;
                                margin: 10px 0;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>🎉 Welcome to RCF University of Ilesa</h1>
                                <p>Admin Portal Account Successfully Created</p>
                            </div>
                            
                            <div class="content">
                                <div class="success-badge">✓ Account Created Successfully</div>
                                
                                <div class="welcome-message">
                                    Hello <strong>${req.body.firstName} ${req.body.lastName}</strong>,
                                </div>
                                
                                <p style="color: #555; font-size: 14px; line-height: 1.8;">
                                    Congratulations! Your administrator account for <strong>RCF University of Ilesa</strong> has been successfully created and is now active. You now have access to the admin portal where you can manage and oversee all administrative functions.
                                </p>
                                
                                <div class="admin-details">
                                    <h3 style="color: #667eea; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Account Information</h3>
                                    <p><strong>Name:</strong> ${req.body.firstName} ${req.body.middleName} ${req.body.lastName}</p>
                                    <p><strong>Email:</strong> ${req.body.email}</p>
                                    <p><strong>Serial Number:</strong> ${serialNumber}</p>
                                    <p><strong>Status:</strong> <span style="color: #4caf50; font-weight: 600;">Active</span></p>
                                </div>
                                
                                <div class="info-box">
                                    <h3>What You Can Do Now</h3>
                                    <p>As an administrator, you have the following privileges:</p>
                                </div>
                                
                                <ul class="features-list">
                                    <li>✓ Full access to the RCF University admin dashboard</li>
                                    <li>✓ View and generate reports</li>
                                    <li>✓ Oversee system operations and configurations</li>
                                    <li>✓ Manage administrative staff and permissions</li>
                                    <li>✓ Access audit logs and system analytics</li>
                                </ul>
                                
                                <div class="next-steps">
                                    <h3>Next Steps</h3>
                                    <ol>
                                        <li><strong>Verify Your Email:</strong> Click the verification link sent to your email to complete account setup (which has been done my receiving this mail)</li>
                                        <li><strong>Log In:</strong> Use your registered email and password to access the admin portal</li>
                                        <li><strong>Complete Your Profile:</strong> Add a profile picture and additional information to personalize your account</li>
                                        <li><strong>Review Documentation:</strong> Check the admin guide for comprehensive instructions on all features</li>
                                    </ol>
                                </div>
                                
                                <div style="text-align: center;">
                                    <a href="http://localhost:5173/admin/signin" class="cta-button">Log In to Your Admin Portal</a>
                                </div>
                                
                                <div class="info-box">
                                    <h3>Important Security Notice</h3>
                                    <p>For your account security, please remember to:</p>
                                    <p>• Never share your login credentials with anyone</p>
                                    <p>• Use a strong, unique password (which you've already provided)</p>
                                    <p>• Enable two-factor authentication when available</p>
                                    <p>• Log out from shared computer/phone after each session</p>
                                </div>
                                
                                <p style="color: #777; font-size: 13px; margin-top: 20px;">
                                    If you did not create this account or have any questions, please contact our support team immediately.
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p><strong>RCF University of Ilesa</strong></p>
                                <p>Media Unit Team</p>
                                <p>© 2025 RCF University of Ilesa. All rights reserved.</p>
                                <p style="margin-top: 15px; font-size: 11px; color: #999;">
                                    This is an automated message. Please do not reply directly to this email.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
        }

        await transporter.sendMail(mailMessage)

        return res.status(200).json({
            success: true,
            message: '🎉 Account Created Successfully!.'
        })

    } catch (err) {
        // console.log('Error registering user:', err)
        return res.status(500).send('Internal server error')
    }
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminUser = await admin.findOne({ email }).select("+password");
        if (!adminUser) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, adminUser.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: adminUser._id },
            JWTKey,
            { expiresIn: "1h" }
        );

        const adminData = {
            _id: adminUser._id,
            firstName: adminUser.firstName,
            middleName: adminUser.middleName,
            lastName: adminUser.lastName,
            email: adminUser.email,
            serialNumber: adminUser.serialNumber,
            passport: adminUser.passport
        };

        return res.status(200).json({
            success: true,
            message: "Admin logged in",
            token,
            admin: adminData
        });

    } catch (err) {
        // console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await admin.findById(req.adminId).select(
            "firstName middleName lastName email serialNumber gender, phoneNumber position passport inductionYear"
        )

        if (!profile) {
            return res.status(404).send("Admin not found")
        }

        return res.status(200).json({
            success: true,
            data: profile
        })


    } catch (e) {
        return res.status(500).send("Internal Server error")
    }
}

exports.updateProfilePost = async (req, res) => {
    try {
        const adminId = req.params.id;

        let uploadedImage = null;

        if (req.file) {
            const uploadRes = await cloudinary.uploader.upload(req.file.path, {
                folder: "rcf_admins"
            });
            uploadedImage = uploadRes.secure_url;
        }

        const updated = await admin.findByIdAndUpdate(
            adminId,
            {
                fullName: req.body.fullName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                phoneNumber: req.body.phoneNumber,
                inductionYear: req.body.inductionYear,
                position: req.body.position,
                passport: uploadedImage
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            message: "Admin updated",
            data: updated
        });

    } catch (err) {
        // console.log("Error controller:", err);
        res.status(500).json({ message: err.message });
    }
};




exports.adminReplyUsersMessages = async (req, res) => {
    try {
        let { messageId, adminId, replyText } = req.body

        replyText = replyText?.trim()

        if (!messageId || !adminId || !replyText) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        const adminUser = await admin.findById(adminId)
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            })
        }

        const originalMessage = await usersMessageModel.findById(messageId)
        if (!originalMessage) {
            return res.status(404).json({
                success: false,
                message: 'Original message not found'
            })
        }

        let reply = await adminReply.create({
            messageId,
            adminId,
            response: replyText,
            emailStatus: 'pending',
            sentAt: new Date()
        })

        let emailStatus = 'sent'

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: churchEmail,
                pass: passkey
            }
        })

        const mailOptions = {
            from: churchEmail,
            to: originalMessage.email,
            subject: 'Response to your message',
            html: `
        <p>Hello ${originalMessage.fullname},</p>
        <p>${replyText}</p>
        <br/>
        <p>Regards,</p>
        <p>RCF University of Ilesa</p>
      `
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (err) {
            emailStatus = 'failed'
        }

        reply.emailStatus = emailStatus
        await reply.save()

        await usersMessageModel.findByIdAndUpdate(
            messageId,
            { replied: true },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: 'Reply processed successfully',
            data: reply
        })

    } catch (err) {
        // console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.markMessageSeen = async (req, res) => {
    try {
        const { id } = req.params

        await usersMessageModel.findByIdAndUpdate(
            id,
            { seen: true }
        )

        return res.status(200).json({
            success: true
        })


    } catch {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.getRepliedMessages = async (req, res) => {
    try {
        const adminUser = await admin.findById(req.adminId);
        if (!adminUser) {
            return res.status(404).send("Admin not found");
        }

        const getUserMessages = await usersMessageModel
            .find({ replied: true })
            .sort({ submittedAt: -1 });

        return res.status(200).json({
            success: true,
            data: getUserMessages
        });

    } catch (err) {
        // console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}