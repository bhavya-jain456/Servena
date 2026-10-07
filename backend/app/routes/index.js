'use strict';

/********************************
 **** Managing all the routes ***
 ********* independently ********
 ********************************/
const Routes = [
    ...require('./v1'),
    ...require('./v2')
];
module.exports = Routes;
