package com.lee.mongod.qna;

import com.lee.mongod.qna.service.IMongoDBService;
import com.lee.mongod.qna.service.MongoDBService;
import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import org.bson.Document;

import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Accumulators.avg;
import static com.mongodb.client.model.Accumulators.sum;
import static com.mongodb.client.model.Aggregates.group;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.out;
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
