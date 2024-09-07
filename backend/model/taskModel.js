const mongoose = require ('mongoose')
const taskSchema = mongoose.Schema(
    {  
         user :{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true                 

    },
        text : {
            type :String,
            required : [true,'please add a text value']
        },
        description: {
            type: String, 
            required: false
          },
    },
    {
        timestamps : true ,
        
    }

)
module.exports = mongoose.model ('Task', taskSchema)