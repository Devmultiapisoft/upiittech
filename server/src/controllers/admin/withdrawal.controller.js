'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminWithdrawalController').getChildLogger();
const { withdrawalDbHandler, userDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            let getList = await withdrawalDbHandler.getAll(reqObj);
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
        let id = req.params.id;
        try {
            let getData = await withdrawalDbHandler.getById(id);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    update: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        try {
            let getByQuery = await withdrawalDbHandler.getOneByQuery({ _id: reqObj.id });
            if (!getByQuery) {
                responseData.msg = "Invailid data";
                return responseHelper.error(res, responseData);
            }
            let updatedObj = {
                approved_at: new Date(),
                remark: reqObj?.remark,
                status: (reqObj.status == 2) ? 2 : ((reqObj.status == 1) ? 1 : 0)
            }

            if (reqObj.status == 2) {
                await userDbHandler.updateOneByQuery({ _id: getByQuery.user_id }, { $inc: { "extra.withdrawals": getByQuery.amount } });
            }

            let updatedData = await withdrawalDbHandler.updateById(reqObj.id, updatedObj);
            responseData.msg = "Data updated successfully!";
            responseData.data = updatedData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "Failed to update data";
            return responseHelper.error(res, responseData);
        }
    },

    getCount: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await withdrawalDbHandler.getCount(reqObj);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getSum: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await withdrawalDbHandler.getSum(reqObj);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
};