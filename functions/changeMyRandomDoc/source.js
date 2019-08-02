exports = function(args){
  var owner_id = args;
  var collection = context.services.get("mongodb-atlas").db("todo").collection("items");
  console.log('Finding a doc owned by ' + owner_id);
  return collection.aggregate([ { $match:  {"owner_id": owner_id} }, { $sample: { size: 1 } } ]).toArray()
    .then(docs => {
      var doc = docs[0];
      if (doc === undefined) {
        console.log('No docs found!');
        return "No docs found for user " + owner_id;
      }
      console.log("Updating " + doc._id);
      var change = !doc.checked;
      console.log("Changing 'checked' value to : " + change);
      return collection.updateOne({_id: BSON.ObjectId(doc._id.toString())},
           { $set: { 'checked': change}}, {upsert:true}).then(r => {
              return "Updated doc " + doc._id.toString() + 
                 " by changing the checked state to '" + 
                 change + "'.";
      });
  }).catch(err=>{
     console.log('Something is wrong...' + err);
     return err;
  });
};




