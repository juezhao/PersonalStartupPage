import { shallow } from 'enzyme';
import Login from '../Login';
import renderer from 'react-test-renderer';


it('snapshot with no content matches', () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders the page component', () => {

    const wrapper = shallow(<Login />);


    expect(wrapper).toContainReact(<div className="templates-wrapper"></div>);
    expect(wrapper).toContainExactlyOneMatchingElement('Banner2');
});