package learning.java.ch11collection.sort;


public class SortableObject implements Comparable<SortableObject> {

	public static enum SortBy {
		INDEX, NAME, VALUE
	}

	public static SortBy SORT = SortBy.INDEX;

	private int m_index;
	private String m_name;
	private String m_value;

	public SortableObject(int index, String name, String value) {
		m_index = index;
		m_name = name;
		m_value = value;
	}

	public void setIndex(int index) {
		m_index = index;
	}

	public int getIndex() {
		return m_index;
	}

	public void setName(String name) {
		m_name = name;
	}

	public String getName() {
		return m_name;
	}

	public void setValue(String value) {
		m_value = value;
	}

	public String getValue() {
		return m_value;
	}

	@Override
	public int compareTo(SortableObject other) {
		if (SORT == SortBy.NAME) {
			return getName().compareTo(other.getName());
		}
		else if (SORT == SortBy.VALUE) {
			return getValue().compareTo(other.getValue());
		}
		return getIndex() - other.getIndex();
	}

	public String toString() {
		return getIndex() + "  " + getName() + "  " + getValue();
	}
}
