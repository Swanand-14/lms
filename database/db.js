import mongoose, { mongo } from "mongoose";
const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000

class DatabaseConnection{
    constructor(){
        this.retryCount = 0
        this.isConnected = false

        mongoose.set('strictQuery',true)
        mongoose.connection.on('connected',()=>{
            console.log("MONGODB CONNECTED SUCCESSFULLY")
            this.isConnected = true

        })
        mongoose.connection.on('error',()=>{
            console.log("MONGODB CONNECTION ERROR")
            this.isConnected=false
        })
        mongoose.connection.on('disconnected',()=>{
            console.log("MONGODB DISCONNECTED")
            this.isConnected = false
            this.handleDisconnection()

        })

        process.on('SIGTERM',this.handleTermination.bind(this))

        
    }
    async connect() {
     try {
           if(!process.env.MONGO_URL){
               throw new Error("MONGO DB URL is not defined in env variable")
           }
           const connectionOptions = {
               useNewUrlParser:true,
               useUnifiedTopology:true,
               maxPoolSize:10,
               serverSelectionTimeoutMS:5000,
               socketTimeoutMS:45000,
               family:4
   
   
           }
           if(process.env.NODE_ENV === 'development'){
               mongoose.set('debug',true)
           }
   
           await mongoose.connect(process.env.MONGO_URL,connectionOptions);
           this.retryCount = 0
     } catch (error) {
        console.log(error.message)
        await this.handleReconnection()
     }
        
    }

    async handleReconnection(){
        if(this.retryCount<MAX_RETRIES){
            this.retryCount++;
            console.log(`Trying to reconnect... Attempt - ${this.retryCount}`)
            await new Promise(resolve => setTimeout(()=>{},RETRY_INTERVAL))
            return this.connect()
        }else{
            console.log(`Failed to connect MONGODB after ${MAX_RETRIES} attempts`)
        }

        process.exit(1)

    }

    async handleDisconnection(){
        if(!this.isConnected){
            console.log("Attempting to reconnect..")
            this.connect()
        }
    }

    async handleTermination(){
        try {
            await mongoose.connection.close()
            console.log("MongoDD connection closed through app termination")
            process.exit(0)
        } catch (error) {
            console.log('Error during database disconnection')
            process.exit(1)
            
        }
    }

    getConnectionStatus(){
        return{
           isConnected : this.isConnected,
           readyState:mongoose.connection.readyState,
           host:mongoose.connection.host,
           name:mongoose.connection.name
        }
    }
}

const dbConnection = new DatabaseConnection()

export default dbConnection.connect.bind(dbConnection)
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);