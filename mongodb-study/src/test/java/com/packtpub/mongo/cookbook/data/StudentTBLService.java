package com.packtpub.mongo.cookbook.data;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static com.mongodb.client.model.Accumulators.avg;
import static com.mongodb.client.model.Accumulators.sum;
import static com.mongodb.client.model.Aggregates.group;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.out;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gt;

/**
 * Created by chealwoo on 1/26/2017.
 */
public class StudentTBLService {
    private static final String STUDENT_TBL_NAME = "student";

    private static MongoCollection<Document> getCollection() {
        return SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
    }

    public static void saveStudent(Document document){
        MongoCollection<Document> collection = getCollection();
        collection.insertOne(document);
    }

    public static void deleteStudentTable(){
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        collection.drop();
    }

    public static void displayTable() {
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        FindIterable<Document> iterable = collection.find();
        for (Document oldDoc : iterable) {
            System.out.println(oldDoc);
        }
    }

    public static FindIterable<Document> getDocumentsByKeyArray(){
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        String[] students = {
                "Ace", "Banner", "Caindale", "Dain", "Earwine"
        };

        BasicDBObject query = (BasicDBObject) QueryBuilder.start("student").in(students).get();
        return collection.find(query);
    }

    public static void main (String[] argv) {
        printCursor(getDocumentsByKeyArray());
    }

    public static void developing() {
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        // Display Ace's total and avg per each teacher
        AggregateIterable<Document> cursor = collection.aggregate(Arrays.asList(match(eq("student", "Ace"))  // ));
                ,group("$teacher"
                        , sum("totalscore", "$score")
                        , avg("Avgscore", "$score")
                )
//                ,out("Student")   // This creates a new MongoCollection
                )
        );

        for (Document d : cursor) {
            System.out.println(d);
        }

        // Display Student Name
        cursor = collection.aggregate(Arrays.asList(
//                match(eq("student", "Ace"))
                group("$student"
//                        , sum("totalscore", "$score")
//                        , avg("Avgscore", "$score")
                )
//                ,out("Student")   // This creates a new MongoCollection
                )
        );

        for (Document d : cursor) {
            System.out.println(d);
        }
    }


    /*
     * Only private/ test after this point
     *
     *
     */
    private static void printCursor(FindIterable<Document> cursor) {
        for (Document d : cursor) {
            System.out.println(d);
        }
    }
    private static void printCursor(AggregateIterable<Document> cursor) {
        for (Document d : cursor) {
            System.out.println(d);
        }
    }

    /**
     * Return all room id after given time in a String array
     *
     * @param timeMillis
     * @return
     */
    private static String[] getRoomCreatedAfter(long timeMillis){
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        long lfilter = System.currentTimeMillis() - timeMillis;

        FindIterable<Document> cursor = collection.find(and(gt("timestamp", lfilter),eq("eventType", "CREATED")));
        Set<String> studentSet = new HashSet<String>();

        for(Document d : cursor){
            studentSet.add(d.getString("student"));
        }

        return studentSet.toArray(new String[studentSet.size()]);
    }
}
