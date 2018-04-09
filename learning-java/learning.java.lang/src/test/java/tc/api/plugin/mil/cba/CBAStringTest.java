package tc.api.plugin.mil.cba;

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CBAStringTest {

    @Test
    public void endpointStringTest() {
        String endpoint = "va-aus.digital.nuance.com";
        assertThat("api-dev-va-aus.digital.nuance.com".contains(endpoint)).isTrue();
        assertThat("api-va-aus.digital.nuance.com".contains(endpoint)).isTrue();
        assertThat("api-preprod-va-aus.digital.nuance.com".contains(endpoint)).isTrue();
        assertThat("api-preprod-vac-aus.digital.nuance.com".contains(endpoint)).isFalse();
    }
}
