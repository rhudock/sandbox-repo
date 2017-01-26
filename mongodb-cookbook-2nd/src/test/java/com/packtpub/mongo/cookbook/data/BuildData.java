package com.packtpub.mongo.cookbook.data;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.Arrays;
import java.util.Random;

/**
 * Created by chealwoo on 1/25/2017.
 */
public class BuildData {

    private static MongoClient client = new MongoClient(Arrays.asList(new ServerAddress("localhost", 27017)));
    private static MongoDatabase db = client.getDatabase("school");

    private static String[] students = {
            "Ace", "Banner", "Caindale", "Dain", "Earwine",
            "Faith", "Gaila", "Hailey", "Ireland", "Jade"
    };

    private static String[] teacher = {
            "Olexa", "Omar", "Orwald"
    };

    private static String[] subject = {
            "English", "Math", "History"
    };

    public static void main (String[] args) {
        StudentTBLService.displayTabel();
    }


    private void buildData(){
        StudentTBLService.deleteStudentTabel();
        Random r = new Random();
        for(int i=0; i < students.length; i++){
            for(int j=0; j < teacher.length; j++) {
                for (int l = 0; l < 10; l++) {
                    Document doc = new Document();
                    doc.put("student", students[i]);
                    doc.put("teacher", teacher[j]);
                    doc.put("subject", subject[j]);
                    doc.put("score", r.nextInt((100 - 0) + 1) + 0);
                    StudentTBLService.saveStudent(doc);
                }
            }
        }
    }
}
