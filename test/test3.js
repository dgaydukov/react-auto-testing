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
        let props = this.props;
        let type = map[props.type] || 'info';
        let className = ['alert', `alert-${type}`].join(' ');
        if(props.message) {
            return (
                <div className={className}>
                    <p>{props.message}</p>
                    {props.children}
                </div>
            )
        }
        return null;
    }
}

class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: true }
        this.accept = this.accept.bind(this);
        this.decline = this.decline.bind(this);
    }
    accept() {
        let { accept } = this.props;
        accept();
        this.setState({ open: false })
    }
    decline() {
        let { decline } = this.props;
        decline();
        this.setState({ open: false })
    }
    render() {
        if(this.state.open) {
            return (
                <Notification {...this.props}>
                    <div className="btn btn-primary" onClick={this.accept}>Sure</div>
                    <div className="btn btn-danger" onClick={this.decline}>Nah</div>
                </Notification>
            )
        }
        return null;
    }
}

class QuestionList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                {this.props.questions.map(item=>{
                    return(
                        <QuestionContainer key={item.id} {...item}/>
                    )
                })}
            </div>
        )
    }
}

class QuestionContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showConfirm: false,
            showAnswer: false,
        }
        this.showConfirm = this.showConfirm.bind(this);
        this.accept = this.accept.bind(this);
        this.decline = this.decline.bind(this);
    }
    showConfirm(){
        this.setState({showConfirm: true});
    }
    accept(){
        this.setState({showAnswer: true});
    }
    decline(){
    }

    render(){
        console.log(this.props)
        const {question, answer} = this.props;
        return (
            <div className="container">
                {this.state.showConfirm && <Confirmation accept={this.accept} decline={this.decline} message="Reveal the answer?"/>}
                <p className="question">{question}</p>
                <div className="btn btn-primary show-answer" onClick={this.showConfirm} disabled={this.state.showAnswer}>Show Answer</div>
                {this.state.showAnswer && <p className="answer">{answer}</p>}
            </div>
        );
    }
}


//-------------------TESTING--------------------------------
(()=>{
    const jsdomify = require('jsdomify').default;
    jsdomify.create();
    const React = require('react'),
        ReactDomServer = require('react-dom/server'),
        assert = require('chai').assert,
        esc = require('escape-html'),
        ReactTestUtils = require('react-dom/test-utils'),
        questions = require('./questions');
    const toMarkup = ReactDomServer.renderToStaticMarkup;
    const create = React.createElement;
    const renderer = ReactTestUtils.createRenderer();
    const {
        findRenderedDOMComponentWithClass,
        scryRenderedDOMComponentsWithClass,
        findRenderedComponentWithType,
        isCompositeComponent,
        renderIntoDocument,
        Simulate
    } = ReactTestUtils;

    describe('QuestionList', function() {
        it('should render to static markup', function() {
            let markup = toMarkup(create(QuestionList, { questions }));
            console.log(markup);
            assert(markup, 'No markup was returned from Question List');
        });
        it('should render the questions', function() {
            let result = renderIntoDocument(create(QuestionList, { questions }));
            let questionEls = scryRenderedDOMComponentsWithClass(result, 'question');
            let actual = JSON.stringify(questionEls.map((el) => el.innerHTML).sort());
            let expected = JSON.stringify(questions.map((item) => item.question).sort());
            assert.equal(actual, expected, 'Questions were not rendered (remember to have use the html class \'question\'!)');
        })
        it('should render the show answer buttons', function() {
            let result = renderIntoDocument(create(QuestionList, { questions }));
            let buttons = scryRenderedDOMComponentsWithClass(result, 'btn btn-primary show-answer');
            assert.lengthOf(buttons, questions.length, 'should be as many buttons as there are questions');
        })
        it('should should not show the answers by default', function() {
            let result = renderIntoDocument(create(QuestionList, { questions }));
            let answers = scryRenderedDOMComponentsWithClass(result, 'answer');
            assert.lengthOf(answers, 0, 'should not initially render any answers');
        })
    })

    describe('QuestionContainer', function() {
        beforeEach(function() {
            this.result = renderIntoDocument(create(QuestionContainer, { ...questions[0] }));
        })
        it('should not show the confirmation by default', function() {
            let result = scryRenderedDOMComponentsWithClass(this.result, 'alert');
            assert.lengthOf(result, 0, 'should be no alert rendered');
        })
        describe('after clicking show answer', function() {
            beforeEach(function() {
                let showButton = findRenderedDOMComponentWithClass(this.result, 'btn btn-primary show-answer');
                Simulate.click(showButton);
            })
            it('should render a confirmation', function() {
                let confirmation = findRenderedDOMComponentWithClass(this.result, 'alert');
                assert(confirmation);
                console.log(confirmation.outerHTML)
            })
            describe('after clicking decline', function() {
                beforeEach(function() {
                    let confirmation = findRenderedComponentWithType(this.result, Confirmation);
                    let decline = findRenderedDOMComponentWithClass(confirmation, 'btn btn-danger');
                    Simulate.click(decline)
                })
                it('should dismiss the confirmation', function() {
                    let result = scryRenderedDOMComponentsWithClass(this.result, 'alert');
                    assert.lengthOf(result, 0, 'should be no alerts found');
                })
            })
            describe('after clicking accept', function() {
                beforeEach(function() {
                    let confirmation = findRenderedComponentWithType(this.result, Confirmation);
                    let accept = findRenderedDOMComponentWithClass(confirmation, 'btn btn-primary');
                    Simulate.click(accept)
                })
                it('should dismiss the confirmation', function() {
                    let result = scryRenderedDOMComponentsWithClass(this.result, 'alert');
                    assert.lengthOf(result, 0, 'should be no alerts found');
                })
                it('should render the answer', function() {
                    let answer = findRenderedDOMComponentWithClass(this.result, 'answer');
                    console.log(answer.outerHTML)
                    assert(answer, 'answer should be visible')
                })
                it('should disable the show answer button', function() {
                    let button = findRenderedDOMComponentWithClass(this.result, 'btn show-answer');
                    console.log(button.outerHTML)
                    assert(button, 'answer should be visible')
                    assert(button.hasAttribute('disabled'), 'should be disabled')
                })
            })
        })
    })
})()