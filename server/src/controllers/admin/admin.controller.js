'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminController').getChildLogger();
const { adminDbHandler, userLoginRequestDbHandler, userDbHandler, incomeDbHandler, settingDbHandler } = require('../../services/db');
const bcrypt = require('bcryptjs');
const jwtService = require('../../services/jwt');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');
const crypto = require('crypto');
const mongoose = require('mongoose')

const { setup } = require('./setup.controller');
const { userModel, incomeModel } = require('../../models');

const { parse } = require('json2csv');
const { levelIncome } = require('../user/cron.controller');

/*******************
 * PRIVATE FUNCTIONS
 ********************/

/**
 * Method to Compare password
 */
let _comparePassword = (reqPassword, userPassword) => {
    return new Promise((resolve, reject) => {
        //compare password with bcrypt method, password and hashed password both are required
        bcrypt.compare(reqPassword, userPassword, function (err, isMatch) {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
};

// Method to create hash password on update
let _createHashPassword = async (password) => {
    let salt = config.bcrypt.saltValue;
    const saltpass = await bcrypt.genSalt(salt);
    // now we set user password to hashed password
    let hashedPassword = await bcrypt.hash(password, saltpass);
    return hashedPassword;
}
let acceptedMedias = ["x.com", "linkedin.com", "facebook.com", "first_youtube", "second_youtube", "third_youtube", "share_first_youtube", "share_second_youtube", "share_third_youtube", "instagram.com"]

function checkMediaExistence(input) {
    const lowercasedInput = input.toLowerCase()
    const existingMedia = acceptedMedias.filter(media => lowercasedInput.includes(media));
    return existingMedia || null
}
/**************************
 * END OF PRIVATE FUNCTIONS
 **************************/
module.exports = {

    getReportsInCSV: async (req, res) => {
        let admin = req.admin;
        let admin_id = admin.sub;

        let typeOfReport = req.params.type;

        log.info('Recieved request for Getting report in csv form:', admin_id, typeOfReport);
        let responseData = {};
        try {

            let data;

            switch (typeOfReport) {
                case 'allUsers':
                    data = await userDbHandler.getByQueryToArray({}, {
                        name: 1,
                        email: 1,
                        phone_number: 1,
                        wallet: 1,
                        wallet_topup: 1,
                        created_at: 1,
                        "extra.levelIncome": 1,
                        "extra.tasksIncome": 1,
                        "extra.levelIncome_withdrawal": 1,
                        "extra.tasksIncome_withdrawal": 1
                    })
                    break;
                case 'income-type-0':
                    data = await incomeDbHandler.getByQueryToArray(
                        {
                            type: 0
                        },
                        {
                            user_id: 1,
                            "extra.mediaType": 1,
                            amount: 1,
                            created_at: 1
                        }).lean()
                    break;
                case 'income-type-1':
                    data = await incomeDbHandler.getByQueryToArray(
                        {
                            type: 1
                        },
                        {
                            user_id: 1,
                            user_id_from: 1,
                            amount: 1,
                            created_at: 1
                        }).lean()
                    break;
                default:
                    throw "Wrong Type!"
            }

            if (data.length === 0) throw "No Data Found"

            const csv = parse(data);
            res.setHeader('Content-Disposition', `attachment; filename=${typeOfReport}.csv`);
            res.setHeader('Content-Type', 'text/csv');
            res.send(csv);

        } catch (error) {
            log.error('Fetching error:', error);
            responseData.msg = error;
            return responseHelper.error(res, responseData);
        }
    },

    get_all_users_data: async (req, res) => {

        let admin = req.admin;
        let admin_id = admin.sub;

        log.info('Recieved request for Getting all users data:', admin_id);
        let responseData = {};
        try {

            const result = await userModel.aggregate([
                {
                    $group: {
                        _id: null, // Group all documents together
                        wallet: { $sum: "$wallet" },
                        wallet_topup: { $sum: "$wallet_topup" },
                        dailyIncome: { $sum: "$extra.dailyIncome" },
                        directIncome: { $sum: "$extra.directIncome" },
                        vipIncome: { $sum: "$extra.vipIncome" },
                        matchingIncome: { $sum: "$extra.matchingIncome" },
                        deposits: { $sum: "$extra.deposits" },
                        withdrawals: { $sum: "$extra.withdrawals" },
                        tokens: { $sum: "$extra.tokens" },
                        tasksIncome: { $sum: "$extra.tasksIncome" },
                        levelIncome: { $sum: "$extra.levelIncome" },
                        tasksIncome_withdraw: { $sum: "$extra.tasksIncome_withdraw" },
                        levelIncome_withdraw: { $sum: "$extra.levelIncome_withdraw" },
                        totalIncome: { $sum: "$extra.totalIncome" },
                        gas_wallet: { $sum: "$extra.gas_wallet" }
                    }
                }
            ]).catch(e => { throw e })

            responseData.data = result.length > 0 ? result[0] : []
            return responseHelper.success(res, responseData)
        } catch (error) {
            log.error('failed to get all users data with error::', error);
            responseData.msg = 'Failed to get Data';
            return responseHelper.error(res, responseData);
        }

    },


    reset_db: async (req, res) => {

        let admin = req.admin;
        let admin_id = admin.sub;

        log.info('Recieved request for Reset Through Admin:', admin_id);

        let responseData = {};
        try {

            const collections = await mongoose.connection.db.collections();

            for (let collection of collections) {
                try {
                    await collection.drop();
                    console.log(`Dropped collection: ${collection.collectionName}`);
                } catch (err) {
                    // Handle the error
                    if (err.message === 'ns not found') {
                        console.log(`Collection ${collection.collectionName} does not exist.`);
                    } else {
                        console.error(`Failed to drop collection ${collection.collectionName}`, err);
                    }
                }
            }

            await setup(req, res, "Success, Now Login for ADMIN and USER Creation to use your app!")

        } catch (e) {

            log.error('failed to get login request with error::', e);
            responseData.msg = 'Failed to reset DB';
            return responseHelper.error(res, responseData);

        }

    },


    user_login_request: async (req, res) => {
        let reqObj = req.body;
        let admin = req.admin;
        let admin_id = admin.sub;
        log.info('Recieved request for Login A User Through Admin:', reqObj);
        let responseData = {};
        try {

            if (!reqObj?.user_id) {
                log.error("Unable to read user_id!")
                responseData = "Unable to read user_id"
                return responseHelper.error(res, responseData)
            }

            const hash = crypto.createHash('sha256').update(Math.random().toString(36).substring(2, 10)).digest('hex')

            await userLoginRequestDbHandler.create(
                {
                    hash,
                    admin_id,
                    user_id: reqObj.user_id
                }
            ).catch(e => { throw e })

            responseData.msg = `Successfully Created Request for ${reqObj.user_id}`
            responseData.data = { url: `${config.appLive === '0' ? config.frontendTestUrl : config.frontendUrl}/login?hash=${hash}` }
            return responseHelper.success(res, responseData)

        } catch (error) {
            log.error('failed to get login request with error::', error);
            responseData.msg = 'Failed to apply for login request';
            return responseHelper.error(res, responseData);
        }
    },
     approveSocial: async (req, res) => {
        let responseData = {};
        let acceptedMedias = ["xUrl", "linkedinUrl", "facebookUrl", "instagramUrl"]

    
        try {
            const { user_id } = req.body; // Extract user_id and acceptedMedias from the request
    
            if (!user_id) {
                throw new Error("User ID is required.");
            }
    
            if (!Array.isArray(acceptedMedias) || acceptedMedias.length === 0) {
                throw new Error("Invalid or empty acceptedMedias array.");
            }
    
            // Get the last accepted media type from the array
            let mediaType = acceptedMedias[acceptedMedias.length - 1]?.split(".")[0];
            if (!mediaType) {
                throw new Error("Invalid media type.");
            }
    
            // Fetch user data
            const user = await userDbHandler.getById(user_id);
            if (!user) {
                throw new Error("User not found.");
            }
    
            // Fetch token distribution settings
            const { value, extra } = await settingDbHandler.getOneByQuery({ name: "tokenDistribution" });
            if (!value || !extra) {
                throw new Error("Token distribution settings not found.");
            }
    
            // Calculate token distribution
            let finVal = value;
            if (user?.extra?.tokens >= 10) {
                finVal = value / 2;
            }
    
            // Adjust tokens based on multiple link verifications
            const tokens = parseFloat(finVal) * acceptedMedias.length; // Multiply by the number of links
            const levels = extra?.levels;
    
            // Update user data with income
            await userDbHandler.updateOneByQuery(
                { _id: user_id },
                {
                    $set: {
                        ["extra.status"]: true,

                    },
                    $inc: {
                        wallet: tokens,
                        "extra.tokens": tokens,
                        "extra.tasksIncome": tokens,
                        "extra.totalIncome": tokens,
                    },
                }
            );
    
            // Log income for the user
            await incomeDbHandler.create({
                user_id: user_id,
                amount: tokens,
                extra: { mediaType: mediaType.includes("youtube") ? "youtube" : mediaType },
                type: 0,
                wamt: tokens,
                iamount: tokens,
                date: Date.now(),
            });
    
            // Generate level income
            await levelIncome(user_id, levels, tokens);
    
            // Success response
            return responseHelper.success(res, { msg: "Link Verified Successfully!" });
        } catch (error) {
            // Error response
            return responseHelper.error(res, { msg: error.message || "An error occurred." });
        }
    },
    
    rejectSocial : async (req, res) => {
        try {
            const user_id = req.body.user_id; // Assuming `user_id` comes from the request body
    
            if (!user_id) {
                throw new Error("User ID is required.");
            }
    
            // List of media types to reject
            const mediaTypes = ["x", "linkedin", "facebook", "instagram"];
    
            // Prepare update query to reset all specified media types
            const updateFields = {};
            mediaTypes.forEach((type) => {
                updateFields[`extra.${type}`] = false;
                updateFields[`extra.${type}Url`] = "";
                updateFields[`extra.status`] = false;
                console.log(`extra.${type}`)
            });
    
            // Update user data
            await userDbHandler.updateOneByQuery(
                { _id: user_id },
                { $set: updateFields },
               
            );
    
            // Success response
            return responseHelper.success(res, { msg: "Links Rejected Successfully!" });
        } catch (error) {
            // Error response
            return responseHelper.error(res, { msg: error.message || "An error occurred." });
        }
    },
    
    add: async (req, res) => {
        let responseData = {};
        // let admin = req.admin;
        // let id = admin.sub;
        let reqObj = req.body;
        try {
            if (reqObj?.email) {
                reqObj.email = reqObj.email.toLowerCase();
            }
            let getByQuery = await adminDbHandler.getByQuery({ email: reqObj.email });
            if (getByQuery.length) {
                responseData.msg = "This email already taken";
                return responseHelper.error(res, responseData);
            }
            let Data = {
                name: reqObj.name,
                email: reqObj.email,
                phone_number: reqObj?.phone_number,
                password: reqObj.password
            }
            await adminDbHandler.create(Data);
            responseData.msg = "Data added successfully!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "Failed to add data";
            return responseHelper.error(res, responseData);
        }
    },

    getAll: async (req, res) => {
        let reqObj = req.query;
        let admin = req.admin;
        let id = admin.sub;
        log.info('Recieved request for getAll Admins:', reqObj);
        let responseData = {};
        try {
            let getList = await adminDbHandler.getAll(reqObj, id);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getOne: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.params.id;
        try {
            let getAdmin = await adminDbHandler.getById(id, { password: 0 });
            responseData.msg = "Data fetched successfully!";
            responseData.data = getAdmin;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    update: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.body.id;
        let reqObj = req.body;
        try {
            if (reqObj?.email) {
                reqObj.email = reqObj.email.toLowerCase();
            }
            let getByQuery = await adminDbHandler.getByQuery({ email: reqObj.email });
            if (getByQuery[0] != undefined && getByQuery[0]._id != id) {
                responseData.msg = "This email is already taken";
                return responseHelper.error(res, responseData);
            }
            let updatedData = {
                name: reqObj.name,
                phone_number: reqObj?.phone_number,
            }

            if (reqObj.email != undefined) {
                updatedData.email = reqObj?.email
            }

            if (reqObj.status !== undefined) {
                updatedData.status = reqObj.status;
            }

            if (reqObj.password) {
                updatedData.password = await _createHashPassword(reqObj.password);
            }
            //}

            let updateAdmin = await adminDbHandler.updateById(id, updatedData);
            responseData.msg = "Data updated successfully!";
            responseData.data = updateAdmin;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "Failed to update data";
            return responseHelper.error(res, responseData);
        }
    }
};