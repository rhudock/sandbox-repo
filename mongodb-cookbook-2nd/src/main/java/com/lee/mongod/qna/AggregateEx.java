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
import static com.mongodb.client.model.Aggregates.*;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Sorts.descending;

/**
 * Created by chealwoo on 12/29/2016.
 *
 * multiple group by
 * http://stackoverflow.com/questions/15564562/how-to-write-multiple-group-by-id-fields-in-mongodb-java-driver
 */
public class AggregateEx {
    private static MongoDatabase db = MongoDBService.getInstance().getDBInstance();

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

        for (Document doc : cursor) {
            // do stuff with doc
        }
    }

    public static void testing2(String roomId) {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT_STAT);
        AggregateIterable<Document> cursor = collection.aggregate(Arrays.asList(match(eq("room", roomId)),
                group("$Ssrc", sum("totalRoundTripTime", "$RoundTripTime"),
                        avg("averageRoundTripTime", "$RoundTripTime")),
                out("ssrc")));

        for (Document d : cursor) {
            System.out.println(d);
        }
    }

    public static void main(String[] args) {
        testing2("ltttest0010");
    }


}
