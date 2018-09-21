import { gql } from 'apollo-boost';

const boothSignup = gql`
    mutation boothSignup($username: String!, $password: String!, $company: String!){
        boothSignup(username: $username, password: $password, company: $company) {
            token
        }
    }
`;

const boothLogin = gql`
    mutation boothLogin($username: String!, $password: String!){
        boothLogin(username: $username, password: $password) {
            token
        }
    }
`;

const getIdentity = gql`
    {
        getIdentity
    }
`

const getCandidates = gql`
    query getCandidates($filter: String, $direction: Int, $count: Int, $skip: Int) {
        getCandidates(filter: $filter, direction: $direction, count: $count, skip: $skip) {
            total
            candidates{
            _id
            identity  {firstName, lastName,email,phone}
            education {school,major,gpa,gradYear,gradMonth}
            }
        }
    }
`
const getMajorData = gql`
{
    getMajorData
    {
      global{
        major
        count
      }
      booth{
        major
        count
      }
    }
  }`

const getGPAData = gql`
{
  getGPAData
  {
    global{
      bucket
      count
    }
    booth{
      bucket
      count
    }
  }
}`

const getCandidate = gql`
    query getCandidate($id: String!) {
        getCandidate(id: $id) {
            identity { firstName, lastName,email,phone}
            education {school,major,gpa,gradYear,gradMonth}
        }
    }
`

const studentSignup = gql`
    mutation studentSignup($firstName: String!, $lastName: String!, $email: String!, $phone: String!, 
        $school: String!, $major: String!, $gpa: Float!, $gradMonth: String!, $gradYear: Int
    ) {
        studentSignup(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone,
            school: $school, major: $major, gpa: $gpa, gradMonth: $gradMonth, gradYear: $gradYear) {
            id
        }
    }
`

const addAttendee = gql`
    mutation addAttendee($identity: Identity!, $experience: [exp], $education: Education!) {
        addAttendee(identity: $identity, education: $education, experience: $experience) {
            id
        }
    }
`

const checkIn = gql`
    mutation checkIn($attendeeId: String!) {
        checkIn(attendeeId: $attendeeId) {
            id
        }
    }
`;

export { boothSignup, boothLogin, getIdentity, getCandidates, getMajorData, getGPAData, getCandidate, studentSignup, addAttendee, checkIn };
