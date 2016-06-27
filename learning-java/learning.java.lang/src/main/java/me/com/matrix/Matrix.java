package me.com.matrix;

/*
    A Matrix of two dimensional array of given size n [n][n]
    Can contain any type of Object.

    Build a function rotates right or left.

    Once this is done build unit test to prove the function is logically correct.

    https://docs.oracle.com/javase/tutorial/java/generics/types.html
    https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html
    http://stackoverflow.com/questions/8725739/correct-way-to-use-stringbuilder
 */

public class Matrix<T> {

    private T[][] tArray;
    private int size;

    public Matrix() {}

    public void buildMatrix(T[][] tArray, int size){
        this.tArray = tArray;
        this.size = size;
    }

    public void fillMatrix(T t, int row, int col){
        if (row < size && col < size) {
            tArray[row][col] = t;
        }
    }

    public T[][] gettArray() {
        return tArray;
    }

    public T getValue(int row, int col){
        return tArray[row][col];
    }

    public int getSize() {
        return size;
    }

    @SuppressWarnings("unchecked")
    public void rotateMatrix(int direction) {
        // like to create a temporary matrix
        Matrix<Object> mat = new Matrix<>();
        int sz = this.getSize();
        mat.buildMatrix(new Object[sz][sz], sz);

        // Copy values to the temp matrix
        for(int i=0; i<sz; i++)
            for(int j=0; j<sz; j++){
                mat.fillMatrix(this.getValue(i, j), i, j);
            }

        // copy back from temp matrix to rotated position.
        if (direction > 0) {
            for (int i = 0; i < sz; i++)
                for (int j = 0; j < sz; j++) {
                    this.gettArray()[j][sz - i - 1] = (T) mat.getValue(i, j);
                }
        } else if (direction < 0) {
            for (int i = 0; i < sz; i++)
                for (int j = 0; j < sz; j++) {
                    this.gettArray()[sz - j - 1][i] = (T) mat.getValue(i, j);
                }
        }
    }

    public void printMatrix () {
        StringBuilder sb = new StringBuilder(0);
        for(int i=0; i<5; i++) {
            for(int j=0; j<5; j++){
                sb.append("\t").append(this.getValue(i, j));
            }
            sb.append("\n");
        }
        System.out.print(sb.toString());
    }

    public static void  main(String[] args){
        Matrix<Integer> mat = new Matrix<>();
        mat.buildMatrix(new Integer[5][5], 5);
        for(int i=0; i<5; i++)
            for(int j=0; j<5; j++){
                mat.fillMatrix(i*5+j, i, j);
            }
        mat.printMatrix();
        mat.rotateMatrix(1);
        System.out.println("\t====================");
        mat.printMatrix();
        System.out.println("\t====================");
        mat.rotateMatrix(-1);
        System.out.println("\t====================");
        mat.printMatrix();
    }
}
