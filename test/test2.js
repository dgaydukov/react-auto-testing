'use strict';


const React = require('react');

const App = (props) => {
    return (
        <div id="app">
            <Notification {...props.notification}/>
        </div>
    )
}
//-------------------solution--------------------------------
const map = {
    success: 'success',
    message: 'info',
    caution: 'warning',
    error: 'danger'
}

class Notification extends React.Component {
    render() {
        let {message, type} = this.props;
        if(!message){
            return null;
        }
        let className = ['alert', `alert-${map[type?type:"message"]}`].join(' ');
        return(
            <div className={className}>
                <p>{message}</p>
                {this.props.children}
            </div>
        )
    }
}

class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
        this.accept = this.accept.bind(this);
        this.decline = this.decline.bind(this);
    }
    accept() {
        const {accept} = this.props;
        accept();
        this.setState({open: false})
    }
    decline() {
        const {decline} = this.props;
        decline();
        this.setState({open: false})
    }
    render() {
        if(!this.state.open) {
            return null;
        }
        return (
            <Notification {...this.props}>
                <div className="btn btn-primary" onClick={this.accept}>Sure</div>
                <div className="btn btn-danger" onClick={this.decline}>Nah</div>
            </Notification>
        )
    }
}

//----------------------------------TESTING-----------------------------------------------
(()=>{
    const jsdomify = require('jsdomify').default;
    jsdomify.create();
    const React = require('react'),
        ReactDOM = require('react-dom'),
        ReactDomServer = require('react-dom/server'),
        assert = require('chai').assert,
        esc = require('escape-html'),
        ReactTestUtils = require('react-dom/test-utils');
    const toMarkup = ReactDomServer.renderToStaticMarkup;
    const toString = ReactDomServer.renderToString;
    const create = React.createElement;
    const renderer = ReactTestUtils.createRenderer();
    const noop = () => {};
    const { findRenderedDOMComponentWithClass, isDOMComponent, isCompositeComponent, renderIntoDocument, Simulate } = ReactTestUtils;


    describe('Confirmation', function() {
        after(() => {
            jsdomify.destroy();
        });
        it('should render to markup', function() {
            let markup = toMarkup(create(Confirmation, { message: 'Is the pie a lie?' }));
            console.log(markup);
            assert(markup, 'No markup was returned from Confirmation');
        });
        it('should be a composite component', function() {

            const result = renderIntoDocument(create(Confirmation, { message: '3.14' }));
            assert(isCompositeComponent(result))
        })
        it('should be of type notification', function() {
            renderer.render(create(Confirmation, { message: 'Still want the pie?' }));
            const result = renderer.getRenderOutput();
            assert.equal(result.type, Notification)
        });
        it('should implement the accept button', function() {
            var called = false;
            function accept() { called = true }
            let result = renderIntoDocument(create(Confirmation, { message: 'Accept the pie.', accept: accept }));
            let primary = findRenderedDOMComponentWithClass(result, 'btn btn-primary');
            Simulate.click(primary);
            assert(called, 'Clicking accept did not work (remember to call the function passed in via props)')
        });
        it('should implement the decline button', function() {
            var called = false;
            function decline() { called = true }
            let result = renderIntoDocument(create(Confirmation, { message: 'DECLINE the PIE?', decline: decline }));
            let danger = findRenderedDOMComponentWithClass(result, 'btn btn-danger');
            Simulate.click(danger);
            assert(called, 'Clicking decline did not work (remember to call the function passed in via props)')
        });
        it('should not render the confirmation after accepting', function() {
            let confirmation = create(Confirmation, { message: 'Acceptapie.', accept: noop, decline: noop});
            let result = renderIntoDocument(confirmation);
            let primary = findRenderedDOMComponentWithClass(result, 'btn btn-primary');
            Simulate.click(primary);
            assert.isNull(ReactDOM.findDOMNode(result), 'Expected the confirmation to render null after accepting')
        })
        it('should not render the confirmation after declining', function() {
            let confirmation = create(Confirmation, { message: 'Just take a bite.', accept: noop, decline: noop});
            let result = renderIntoDocument(confirmation);
            let danger = findRenderedDOMComponentWithClass(result, 'btn btn-danger');
            Simulate.click(danger);
            assert.isNull(ReactDOM.findDOMNode(result), 'Expected the confirmation to render null after declining')
        })
    })
})()
