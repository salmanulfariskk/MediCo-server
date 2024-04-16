const securePassword = require('../utils/nodeMailer.js')
const Doctor = require('../models/doctorModel.js')
const cloudinary = require('../utils/cloudinary.js')
const sendEmail = require("../utils/doctorMailer.js")

const signup = async (req,res) => {
    try {
        const { name, mobile, email, speciality, password, photo, certificates } = req.body
        const spassword = await securePassword(password)
        const emailExist = await Doctor.findOne({ email: email })
        if (emailExist) {
            res.status(409).json({ status: "Partner already registered with this email" });
        } else {
            const photoResult = await cloudinary.uploader.upload(photo, { folder: 'doctorPhotos' });

            // Upload multiple certificates to Cloudinary
            const certificateResults = await Promise.all(certificates.map(async (certificate) => {
                return await cloudinary.uploader.upload(certificate, { folder: 'doctorsCertificates' });
            }));

            const doctor = new Doctor({
                name: name,
                mobile: mobile,
                email: email,
                speciality: speciality,
                password: spassword,
                photo: photoResult.secure_url,
                certificates: certificateResults.map(result => result.secure_url)
            })
            const doctorData = await doctor.save()
            otpId = await sendEmail(
                doctorData.name,
                doctorData.email,
                doctorData._id,
            )
            res.status(201).json({
                status: `Otp has sent to ${email}`, doctorData: doctorData, otpId: otpId,
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "Internal Server Error" });
    }
}


module.exports = {
    signup,

}