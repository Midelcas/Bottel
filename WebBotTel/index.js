const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = "DEVICETELEMETRY";
const MAX_ROWS = 20;

module.exports = function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item:', myQueueItem);
    
    var query = new azure.TableQuery().top(1).where('deviceId == ?','g5-rpi-simulated');

    tableService.queryEntities(tableName, query, null, function (error, result, response) {
        if (!error) {
            context.log(response.body.value);
            context.log(response.body.value[0].deviceId);

            var message = {
                'text': response.body.value,
                'address': myQueueItem.address
            };
            context.done(null,message);
        } else {
            context.done(null,'error' );
        }
    });
};