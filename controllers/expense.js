const expenseDetails=require('../model/expenseData');
const expsAmt=require('../model/totalExpenses');
const config=require('../configuration/config');
const jwt=require('jsonwebtoken');
const AWS=require('aws-sdk');
const { use } = require('../routes/expense');
exports.postDetails=async (req,res,next)=>{
    try{
        const expenseAmt=req.body.expense_amount;
        const des=req.body.description;
        const cat=req.body.category;
        const token = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(token, config.secretKey);
        const userId = decodedToken.id;
        const response=await expenseDetails.create({
            expense_amount:expenseAmt,
            description:des,
            category:cat,
            signupDatumId:userId,
            
        })
        const totalExpRecord = await expsAmt.findOne({where:{signupDatumId:userId}});
        let totalExp;
        if(cat!=='Income'){
            if (totalExpRecord) {
                totalExp = totalExpRecord.totalExpense + parseInt(expenseAmt);
            } else {
                totalExp = parseInt(expenseAmt);
            }
        }
        if (totalExpRecord) {
            await totalExpRecord.update({ totalExpense: totalExp });
        } else {
            await expsAmt.create({
                 totalExpense: totalExp,
                 signupDatumId:userId,
            });
        }
        res.status(200).json({expenseData:{response}});
    }catch(error){
        console.log(error);
    }
}

exports.getDetails = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(token, config.secretKey);
        const userId = decodedToken.id;
        console.log(userId);
        console.log(token);
        const page = parseInt(req.query.page) || 1;
        const itemsPerPages = parseInt(req.query.itemsPerPage);
        console.log("size is",itemsPerPages);

        const offset = (page - 1) * itemsPerPages;
        
        const expenses = await expenseDetails.findAll({
            where: { signupDatumId: userId },
            limit: itemsPerPages,
            offset: offset
        });
        const count = await expenseDetails.count({
            where: { signupDatumId: userId }
        });

        res.status(200).json({
            getExpense: expenses,
            currentPage: page,
            itemsPerPage: itemsPerPages,
            totalItems: count,
            hasNextPage: itemsPerPages * page < count,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(count / itemsPerPages)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }

}

function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        Bucket:BUCKET_NAME
    })
    s3bucket.createBucket(()=>{
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('somthing is wrong',err);
                    reject(err);
                }else{
                    console.log('success',s3response);
                    resolve(s3response.Location);
                }
            })
        })
            
    })
}
exports.downloadExpense=async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
            const decodedToken = jwt.verify(token, config.secretKey);
            const userId = decodedToken.id;
            const getExpense=await expenseDetails.findAll();
            const stringifyExpense=JSON.stringify(getExpense);

            const filename=`Expense${userId}/${new Date()}.txt`;
            const fileURL=await uploadToS3(stringifyExpense,filename);
            res.status(200).json({fileURL,success:true});
        
        console.log(getExpense);
    }catch(err){
        console.log(err);
        res.status(500).json({fileURL,success:false});
    }
}
exports.deleteDetails = async (req, res, next) => {
    const expenseId = req.params.id;
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(token, config.secretKey);
        const userId = decodedToken.id;
        console.log(token);
        console.log(decodedToken);
        console.log(userId);
        const transaction = await expenseDetails.sequelize.transaction();

        try {
            const expenseToDelete = await expenseDetails.findOne({
                where: { id: expenseId, signupDatumId: userId },
                transaction
            });

            if (!expenseToDelete) {
                throw new Error('Expense not found');
            }
            await expenseToDelete.destroy({ transaction });
            const totalExpRecord = await expsAmt.findOne({where:{signupDatumId:userId}});
            if(expenseToDelete.category!=='Income'){
                if (totalExpRecord) {
                    totalExpRecord.totalExpense -= expenseToDelete.expense_amount;
                    await totalExpRecord.save({ transaction });
                }
            }
            await transaction.commit();

            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting the expense' });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
