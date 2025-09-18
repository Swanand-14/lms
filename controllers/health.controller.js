import {getDBStatus} from '../database/db.js'
export const checkHealth = async(req,res)=>{
 try {
       const dbStatus = getDBStatus();
       const healthStatus = {
           status:'OK',
           timeStamp:new Date().toISOString(),
           services:{
               database:{
                   status:dbStatus.isConnected ? 'healthy':'unhealthy',
                   detail:{
                       ...dbStatus,
                       readyState:getReadyStateText(dbStatus.readyState)
                   }
               },
               server:{
                   status:'healthy',
                   uptime:process.uptime(),
                   memoryUsage:process.memoryUsage()
               }
           }
       }
   
       const httpStatus = healthStatus.services.database.status === 'healthy'?200:503
   
       res.status(httpStatus).json(healthStatus)
 } catch (error) {

    console.error('Health Check Error',error)

    res.status(500).json({
        status:'Error',
        timeStamp:new Date().toDateString(),
        error:error.message
    })
    
 }
}



function getReadyStateText(state){
    switch (state) {
        case 0:return 'disconnnected';
        case 1:return 'connnected';
        case 2:return 'connnecting';
        case 3:return 'disconnnected';
    
        default:
        return 'unknown'
    }
}

