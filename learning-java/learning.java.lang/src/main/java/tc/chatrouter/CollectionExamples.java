package tc.chatrouter;

import com.google.common.collect.ImmutableSortedSet;
import tc.util.BytesComparator;

import java.util.Set;

public class CollectionExamples {

    public void example() {
        final Set<byte[]> hide_agent_attributes_fields =
                ImmutableSortedSet.orderedBy(BytesComparator.INSTANCE).add(
                        "key_agent_site_attrs".getBytes(),
                        "KEY_AGENT_ATTRIBUTES".getBytes()).build();
    }
}
