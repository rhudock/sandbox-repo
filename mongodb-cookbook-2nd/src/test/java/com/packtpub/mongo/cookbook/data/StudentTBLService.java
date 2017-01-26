package com.packtpub.mongo.cookbook.data;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.Arrays;

import static com.mongodb.client.model.Accumulators.avg;
import static com.mongodb.client.model.Accumulators.sum;
import static com.mongodb.client.model.Aggregates.group;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.out;
import static com.mongodb.client.model.Filters.eq;

/**
 * Created by chealwoo on 1/26/2017.
 */
public class StudentTBLService {
    private static final String STUDENT_TBL_NAME = "student";


    public static void saveStudent(Document document){
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        collection.insertOne(document);
    }

    public static void deleteStudentTabel(){
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        collection.drop();
    }

    public static void displayTabel() {
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        FindIterable<Document> iterable = collection.find();
        for (Document oldDoc : iterable) {
            System.out.println(oldDoc);
        }
    }

    public static void main (String[] argv) {
        MongoCollection<Document> collection = SchoolDBService.db.getCollection(STUDENT_TBL_NAME);
        AggregateIterable<Document> cursor = collection.aggregate(Arrays.asList(match(eq("student", "Ace"))  // ));
                ,group("$Steacher"
                        , sum("totalscore", "$score")
                        , avg("Avgscore", "$score")
                )
//                ,out("Student")
                )
        );

        for (Document d : cursor) {
            System.out.println(d);
        }
    }
}
