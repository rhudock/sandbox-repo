package com.lee.mongod.qna;

import com.lee.mongod.qna.service.IMongoDBService;
import com.lee.mongod.qna.service.MongoDBService;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import static com.mongodb.client.model.Sorts.descending;

/**
 * Created by chealwoo on 12/29/2016.
 */
public class DistinctEx {
    private static MongoDatabase db = MongoDBService.getInstance().getDBInstance();


    public static FindIterable<Document> readWebCallEndpointByCall(String callId) {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT);

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("room", callId);

        FindIterable<Document> cursor = collection.find(searchQuery);

        BasicDBObject projection = new BasicDBObject();
        projection.put("_id", 0);

        for (Document d : cursor) {
            System.out.println(d);
        }

        System.out.println("=== distinct ===");
        MongoCursor<String> ids = collection.distinct("Id", String.class).iterator();

        while (ids.hasNext()) {
            System.out.println(ids.next());
        }

        return cursor;
    }

    public static MongoCursor<String> readEndpointsInCall(String callId) {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT);

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("room", callId);

        FindIterable<Document> cursor = collection.find(searchQuery);

        MongoCursor<String> ids = collection.distinct("participant", String.class).iterator();

        while (ids.hasNext()) {
            System.out.println(ids.next());
        }

        return ids;
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
