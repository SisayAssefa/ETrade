var serviceUrlHostName = ''; 
serviceUrlHostName = 'http://10.1.17.22/ServiceLayer/';
var MessageQueue = new Array();
//ajax refersh interval 
var interval = 10000;
//Maximim Order Qty Per Ticket.
var MaximimOrderQtyPerTicket = 1000;
var MaximumPriceForAllCommodity = 9999;
var MinimumPriceForAllCommodity = 99;
var MyWatchListUpdateInterval = 5000;
var MarketWatchFilterRefreshRate = 30000;
var OrderInformationTabRefreshRate = 5000;
var DeployPath = "/ECXTP"; //For local use it is "", for server "/ECXTP" due to folder structure change
var MarketStatusRefreshRate = 10000;

var isEditedPriceInRange = false;
var PriceRangeInfo = "";
var UpperPriceLimitGlobal = "";
var LowerPriceLimitGlobal = "";
var PreviousClosePrice = '';
var MaximumNORecords = 100;

var CurrentMarketStatus = false;
var MaxMultipleClientCount = 20;
var LotInQuintal = 50;