const mongoose = require('mongoose');
const Quote = require('./models/quote');
const productQuote = require('./models/productQuote');
const sf = require("./unum/salesforce") ; 

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to db
const db = mongoose.connect('mongodb://localhost:27017/customerQuotes', {
  useNewUrlParser: true 
});

// Import model

// Add Quote
const addQuote = (quote) => {
 var obj = {} ; 
 obj.accName = quote.accName ; 
 obj.eligibleLives = quote.eligibleLives ; 


  Quote.create(obj).then(obj => {
      //Create the QuoteProduct
      var products = quote.products ; 
      var dbProducts = [] ; 
      products.forEach(element => {  
        var prod = {} ; 
        prod.productName = element ; 
        prod.quoteId = obj.id ; 
        dbProducts.push(prod) ;
      });
      productQuote.insertMany(dbProducts).then(element => {
        mongoose.connection.close()
      }) ; 
     
     console.info('New Quote Added : ' +obj.id);
  });

}
const getQuotes = () => {
    Quote.find()
    .exec((err, quotes) => {
     quotes.forEach(function(quote){
        productQuote.find({ quoteId: quote.id}).exec(function (err, records) {
            console.log("\nCustomer Name : " + quote.accName) ; 
            console.log("Eligible Lives : " + quote.eligibleLives) ;
            console.log("Quote Id : " + quote.id) ;
            console.log("Sent RFP: " + quote.sentRFP) ;

            console.log("Products")
            records.forEach(function(prod){
                console.log("\tProduct  : " + prod.productName) ;
            }) ; 
            mongoose.connection.close() ; 
        });

     }) ; 
    })
  }
  
const sendQuote = (quoteId) =>{
  console.log("Sending Quote")
   Quote.find({_id: quoteId}).exec(function (err, theQuote) {
        //Once the quote is found get the products 
        productQuote.find({ quoteId: quoteId}).exec(function (err, records) {
              //build up the respone 
              var body = {} ; 
              var company = {} ; 
              company.name = theQuote[0].accName ; 
              company.UNUM_ID__c =  theQuote[0].accName.trim()  ; 
              var products = [] ;
              var opportunity = {} ; 
              opportunity.name = theQuote[0].accName + ' Opportunity '  ;  
              opportunity.Eligible_Lives__c = theQuote[0].eligibleLives  ; 
              opportunity.Type = 'New' ;  
              opportunity.PRCNG_AUTH_TXT__c = 'Field Office' ; 
              opportunity.StageName = 'Lead' ; 
              opportunity.CloseDate = new Date().toJSON();   //  07-06-2016 06:38:34
             opportunity.Products__c = '' ; 


              records.forEach(function (rec){
                  var product = {} ; 
                  product.ELIG_LIVES_QTY__c = theQuote[0].eligibleLives   ; 
                  product.PRODT_ID__r = {} ; 
                  product.PRODT_ID__r.Name = rec.productName ; 
                  opportunity.Products__c = rec.productName + ';' +opportunity.Products__c ;  
                  products.push(product) ; 
              }) ; 
              body.company = company ; 
              body.opportunity = opportunity ; 
              body.products = products ; 
          
              sf.salesforceConnection.apex.post("/Quoting/", body, function(res) {
                //finally update the sent to RFP 
                theQuote[0].sentRFP = true ; 
               theQuote[0].save(function(err, updatedQuote){
                 mongoose.connection.close() ; 
               }) ; 
             
              }) ; 
              

              
       }); 
  });
    
 

}

// Export All Methods
module.exports = {
    addQuote, 
    getQuotes,
    sendQuote
    
}