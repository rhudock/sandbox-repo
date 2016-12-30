package com.lee.mongod.qna;

import com.lee.mongod.qna.service.IMongoDBService;
import com.lee.mongod.qna.service.MongoDBService;
import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import org.bson.Document;

import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Sorts.descending;

/**
 * Created by chealwoo on 12/29/2016.
 */
public class DistinctEx {
    private static MongoDatabase db = MongoDBService.getInstance().getDBInstance();



    public static MongoCursor<String> readCallEndpoints(String callId) {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT);

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("room", callId);

        FindIterable<Document> cursor = collection.find(searchQuery);

        MongoCursor<String> ids = collection.distinct("participant", String.class).iterator();


/*        while (ids.hasNext()) {
            BasicDBObject searchQuery = new BasicDBObject();
            searchQuery.put("participant", ids.next());

            FindIterable<Document> cursor = collection.find(searchQuery).sort(descending("participant"))

            System.out.println(ids.next());
        }*/

        return ids;
    }

/*
http://stackoverflow.com/questions/38202897/mongo-aggregation-in-java-group-with-multiple-fields
 */
    public static void testing(String roomId) {
        Document matches = new Document("$match",
                new Document("gi", new Document("$ne", null))
                        .append("room", roomId));

        Document firstGroup = new Document("$group",
                new Document("_id",
                        new Document("ci", "$ci")
                                .append("gi", "$gi")
                                .append("gn", "$gn")
                                .append("si", "$si"))
                        .append("count", new Document("$sum", 1)));

        Document secondGroup = new Document("$group",
                new Document("_id",
                        new Document("ci", "$_id.ci")
                                .append("gi", "$_id.gi")
                                .append("gn", "$_id.gn"))
                        .append("ns", new Document("$sum", 1)));

        Document sort = new Document("$sort",
                new Document("_id.gi", 1));

        List<Document> pipeline = Arrays.asList(matches, firstGroup, secondGroup, sort);
        AggregateIterable<Document> cursor = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT).aggregate(pipeline);

        for(Document doc : cursor) { // do stuff with doc }
    }
    }

   public static void testing2(String roomId) {
       MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT);
       collection.aggregate(Arrays.asList(match(eq("author", "Dave")),
               group("$customerId", sum("totalQuantity", "$quantity"),
                       avg("averageQuantity", "$quantity"))
               out("authors")));
    }


    public static void main(String[] args) {
        readAllCallId();
    }


    public static MongoCursor<String> readAllCallId() {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT);
        MongoCursor<String> ids = collection.distinct("participant", String.class).iterator();
        Document doc = new Document();

        while (ids.hasNext()) {
            BasicDBObject searchQuery = new BasicDBObject();
            searchQuery.put("participant", ids.next());

            FindIterable<Document> cursor = collection.find(searchQuery).sort(descending("participant"));

            System.out.println(ids.next());
        }

        return ids;
    }
}
