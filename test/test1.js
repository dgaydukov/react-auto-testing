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
                {message}
            </div>
        )
    }
}

//-------------------TESTING--------------------------------
(()=>{
    const React = require('react'),
        ReactDomServer = require('react-dom/server'),
        assert = require('chai').assert,
        esc = require('escape-html');
    const toMarkup = ReactDomServer.renderToStaticMarkup;
    const toString = ReactDomServer.renderToString;
    const create = React.createElement;
    describe('Notification', () => {
        it('should handle all messages being passed', function() {
            let messages = [
                'Hello World',
                'Welcome to the Jungle',
                'Welcome back my friends to the show that never ends!',
                'Buenos Dias!'
            ]
            messages.forEach(message => {
                let el = create(App, { notification: { message } })
                assert.include(toMarkup(el), message)
            })
        })
        it('should not display the notification with no app props', function() {
            let app = create(App);
            assert.equal(toMarkup(app), '<div id="app"></div>');
        })
        it('should not display the notification with no notification props', function() {
            let app = create(App, { notification: {} });
            assert.equal(toMarkup(app), '<div id="app"></div>');
        })
        it('should default to alert-info', function() {
            let el = create(App, { notification: { message: 'Gotta default!' } })
            assert.include(toMarkup(el), 'class="alert alert-info"')
        })
        it('should map notification types to bootstrap classes', function() {
            let map = {
                success: 'success',
                message: 'info',
                caution: 'warning',
                error: 'danger'
            }
            let message = 'Im classy!';
            Object.keys(map).forEach(type => {
                let klass = map[type];
                let el = create(App, { notification: { message, type } })
                assert.include(toMarkup(el), `class="alert alert-${klass}"`)
            })
        })
        it('should render to some HTML', function() {
            let component = create(App, { notification: { message: 'Hello World!'} });
            console.log('Rendering:<br/>' + toString(component));
            console.log('Actual Markup:<br/>' + esc(toMarkup(component)));
        })
        it('should contain the message I pass in', function() {
            let message = 'Notification to the end-user!'
            let app = create(App, { notification: { message }});
            assert.include(toMarkup(app), message)
        })
    });
})()