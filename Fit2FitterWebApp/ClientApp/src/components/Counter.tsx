import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as CounterStore from '../store/Counter';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, Card, Icon, Image } from 'semantic-ui-react'

type CounterProps =
    CounterStore.CounterState &
    typeof CounterStore.actionCreators &
    RouteComponentProps<{}>;

class Counter extends React.PureComponent<CounterProps> {
    onSubmit = () => {
        console.log("test");
        return <Redirect to="/login" />
    }

    public render() {
        return (
            <React.Fragment>
                <h1>Counter</h1>

                <p>This is a simple example of a React component.</p>

                <Button basic onClick={this.onSubmit}>Login</Button>

                <p aria-live="polite">Current count: <strong>{this.props.count}</strong></p>

                <button type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => { this.props.increment(); }}>
                    Increment
                </button>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.counter,
    CounterStore.actionCreators
)(Counter);
