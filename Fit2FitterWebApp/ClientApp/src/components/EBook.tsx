import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, Grid, Segment, Menu } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { RouteComponentProps } from 'react-router';

interface IProps {
}

interface IState {
    activeItem: string;
    username: string;
    password: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class EBook extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', activeItem: 'BTPGuide',
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getPdf = () => {
        var divPdf = {
            width: '100%',
            height: '700px'
        };

        if (this.state.activeItem === 'Workout') {
            return (<iframe src="https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/HomeWorkoutGuideBTP3.1.pdf&amp;embedded=true" style={divPdf}/>);
        }

        if (this.state.activeItem === 'BTPGuide') {
            return (<iframe src="https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/BTP36WeekGuide.pdf&amp;embedded=true" style={divPdf}/>);
        }

        return (<div>
            <iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/IdaFit2FitterSeptemberRecipepack.pdf&amp;embedded=true" style={divPdf}/>
        </div>)
    }

    render() {
        var divPdf = {
            width: '100%',
            height: '700px'
        };

        if (this.props.logins.length > 0) {
            return (
                <div>
                    <Menu attached='top' pointing secondary color='pink' compact>
                        <Menu.Item
                            name='BTPGuide'
                            active={this.state.activeItem === 'BTPGuide'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='BTPRecipe'
                            active={this.state.activeItem === 'BTPRecipe'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Workout'
                            active={this.state.activeItem === 'Workout'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>

                    <div style={divPdf}>
                        {this.getPdf()}
                    </div>
                </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(EBook as any);