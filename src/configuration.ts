export const Config = {
    logs:{ 
        appenders: {
            out: {type : 'stdout', layout: {type: 'colored'}}
        },
        categories:{
            default: { appenders: ["out"], level: 'debug' },
            'prime-food': { appenders: ["out"], level: 'debug' }
        }
    }
}