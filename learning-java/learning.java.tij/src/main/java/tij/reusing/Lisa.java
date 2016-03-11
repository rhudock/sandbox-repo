package tij.reusing; //: reusing/Lisa.java
// {CompileTimeError} (Won't compile)

/*class Lisa extends Homer {
  @Override void doh(Milhouse m) {
    System.out.println("doh(Milhouse)");
  }
} fix is below*/
class Lisa extends Bart {
	@Override void doh(Milhouse m) {
		System.out.println("doh(Milhouse)");
	}
} ///:~
