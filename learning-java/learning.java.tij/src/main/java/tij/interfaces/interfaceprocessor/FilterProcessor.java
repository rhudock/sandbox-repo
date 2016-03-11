//: interfaces/interfaceprocessor/FilterProcessor.java
package tij.interfaces.interfaceprocessor;
import tij.interfaces.filters.BandPass;
import tij.interfaces.filters.Filter;
import tij.interfaces.filters.HighPass;
import tij.interfaces.filters.LowPass;
import tij.interfaces.filters.Waveform;

class FilterAdapter implements Processor {
  Filter filter;
  public FilterAdapter(Filter filter) {
    this.filter = filter;
  }
  public String name() { return filter.name(); }
  public Waveform process(Object input) {
    return filter.process((Waveform)input);
  }
}	

public class FilterProcessor {
  public static void main(String[] args) {
    Waveform w = new Waveform();
    Apply.process(new FilterAdapter(new LowPass(1.0)), w);
    Apply.process(new FilterAdapter(new HighPass(2.0)), w);
    Apply.process(
      new FilterAdapter(new BandPass(3.0, 4.0)), w);
  }
} /* Output:
Using Processor LowPass
Waveform 0
Using Processor HighPass
Waveform 0
Using Processor BandPass
Waveform 0
*///:~
