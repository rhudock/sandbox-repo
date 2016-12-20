package cwl.mongodb;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.Date;

/**
 * http://www.mkyong.com/mongodb/java-mongodb-hello-world-example/
 */
public class HelloMongoDb32 {
    public static void main(String[] args) {

        try {

            /**** Connect to MongoDB ****/
            // Since 2.10.0, uses MongoClient
            MongoClient mongo = new MongoClient("172.26.111.99", 27017);

            /**** Get database ****/
            // if database doesn't exists, MongoDB will create it for you
            MongoDatabase db = mongo.getDatabase("testdb");

            /**** Get collection / table from 'testdb' ****/
            // if collection doesn't exists, MongoDB will create it for you
            MongoCollection<Document> user = db.getCollection("user");

            /**** Insert ****/
            // create a document to store key and value
            Document document = new Document();
            document.put("name", "daniel");
            document.put("age", 30);
            document.put("createdDate", new Date());
            user.insertOne(document);

            /**** Find and display ****/
            BasicDBObject searchQuery = new BasicDBObject();
            searchQuery.put("name", "daniel");

            FindIterable<Document> cursor = user.find(searchQuery);

            for (Document d: cursor) {
                System.out.println(d);
            }

            /**** Update ****/
            // search document where name="mkyong" and update it with new values
            BasicDBObject query = new BasicDBObject();
            query.put("name", "daniel");

            BasicDBObject newDocument = new BasicDBObject();
            newDocument.put("name", "daniel-updated");

            BasicDBObject updateObj = new BasicDBObject();
            updateObj.put("$set", newDocument);

            user.updateOne(query, updateObj);

            /**** Find and display ****/
            BasicDBObject searchQuery2
                    = new BasicDBObject().append("name", "daniel-updated");

            FindIterable<Document> cursor2 = user.find(searchQuery2);

            for (Document d: cursor2) {
                System.out.println(d);
            }

            /**** Done ****/
            System.out.println("Done");

        } catch (MongoException e) {
            e.printStackTrace();
        }

    }
}
