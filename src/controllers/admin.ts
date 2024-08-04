import {Application, Request, Response, NextFunction} from "express"
import { failedResponse, successResponse } from '../support/http'; 
import { httpLogger } from '../httpLogger';
import { generateRandomAlphNumeric, sendTemplateMail, writeErrorsToLogs } from '../support/helpers';
import { Media, Talent, User } from '../models/users';
import { talentValidator } from "../validator/user";

export class AdminDashboard {
    static async users(req: Request, res: Response, next: NextFunction) {
        try {
            const { role, page = 1, pageSize = 10 } = req.query;

            const filter: any = {};
            if (role) filter.role = role;

            const skip = (Number(page) - 1) * Number(pageSize);
            const totalUsers = await User.countDocuments(filter);
            const totalPages = Math.ceil(totalUsers / Number(pageSize));

            const users = await User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(pageSize))
                .select("name _id userType email userType")

            return successResponse(res, 200, "Success", {
                users,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: Number(page),
                    pageSize: Number(pageSize)
                }
            });
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    };
    static async singleUser(req: Request, res: Response, next: NextFunction) {
        try {

            const users = await User.findById(req.params.id)
            .populate("picture")
            .select("-password")
            return successResponse(res, 200, "Success", {
                users,
            });
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    };
};


export class TalentController {
    // Create a new talent entry
    static async createTalent(req: Request, res: Response, next: NextFunction) {
        try {
            // Validate request body
            const { error, value } = talentValidator.validate(req.body);
            if (error) return failedResponse(res, 400, error.details[0].message);

            // Check if talent with the same email already exists
            const existingTalent = await Talent.findOne({ email: value.email});
            if (existingTalent) {
                return failedResponse(res, 409, "Talent with this email already exists");
            }

            // Create new talent
            const talent = new Talent(value);
            await talent.save();

            return successResponse(res, 201, "Talent created successfully", talent);
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    };
    // Get all talent entries with pagination
    static async getAllTalents(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, pageSize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pageSize);
            const totalTalents = await Talent.countDocuments();
            const totalPages = Math.ceil(totalTalents / Number(pageSize));

            const talents = await Talent.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(pageSize))
                .select("-__v"); // Exclude version field

            return successResponse(res, 200, "Success", {
                talents,
                pagination: {
                    totalTalents,
                    totalPages,
                    currentPage: Number(page),
                    pageSize: Number(pageSize)
                }
            });
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    }

    // Get a single talent entry by ID
    static async getTalentById(req: Request, res: Response, next: NextFunction) {
        try {
            const talent = await Talent.findById(req.params.id).select("-__v");

            if (!talent) return failedResponse(res, 404, "Talent not found");

            return successResponse(res, 200, "Success", talent);
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    };
    // Delete a talent by ID
    static async deleteTalent(req: Request, res: Response, next: NextFunction) {
        try {
            const talent = await Talent.findByIdAndDelete(req.params.id);
            if (!talent) return failedResponse(res, 404, "Talent not found");

            return successResponse(res, 200, "Talent deleted successfully");
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    };

    static async sendLoginCredentials(req: Request, res: Response, next: NextFunction) {
        try {
            const talentId = req.params.id;
            const talent = await Talent.findById(talentId);

            if (!talent) return failedResponse(res, 404, "Talent not found");
            if (talent.onboarded) return failedResponse(res, 400, "Talent already onboarded");

            const tempPassword = generateRandomAlphNumeric()
            const context = {
                password : tempPassword,
                fullname:talent.name,
                email:talent.email,
            }
            const sendDetials = await sendTemplateMail(talent.email, "Login credentials", "templates/login_credentials.html", context )
            // update the talent:
            talent.onboarded = true;
            talent.save();

            // create the user
            await User.create(context);
            return successResponse(res, 200, "Login credentials sent successfully");
        } catch (error: any) {
            writeErrorsToLogs(error);
            return failedResponse(res, 500, error.message);
        }
    }
}