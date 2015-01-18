package <%= libPackage %>;

/**
 * Dummy test.
 *
 * @author <%= authorName %>
 * @since <%= date %>
 */
class DummyTest extends AbstractTest {

    def "Check something important"() {

        when: "do something"
        Integer checkAssignment = 1
        then: "check result"
        checkAssignment == 1
    }
}
