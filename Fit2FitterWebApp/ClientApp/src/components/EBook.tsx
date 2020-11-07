import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, Grid, Segment, Menu, Dropdown, Label } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { RouteComponentProps } from 'react-router';

interface IProps {
}

interface IState {
    activeItem: string;
    recipeText: string
    username: string;
    password: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

const options = [
    { key: 'StarterPack Recipes', value: 'StarterPack Recipes', text: 'StarterPack Recipes' },
    { key: 'September Recipes', value: 'September Recipes', text: 'September Recipes' },
    { key: 'October Recipes', value: 'October Recipes', text: 'October Recipes' }
]


class EBook extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', activeItem: 'BTPGuide', recipeText:'StarterPack Recipes'
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    onSelectionChanged = (e: any, value: any) => {
        console.log(value['value']);
        this.setState({ activeItem: value['value'], recipeText: value['value'] })
    }

    getPdf = () => {
        var divPdf = {
            width: '100%',
            height: '700px'
        };

        if (this.state.activeItem === 'Workout') {
            return (<div><iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/HomeWorkoutGuideBTP3.1.pdf&amp;embedded=true" style={divPdf} /></div>);
        }

        if (this.state.activeItem === 'StarterPack Recipes') {
            return (<div><iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/BTP3StarterRecipePack.pdf&amp;embedded=true" style={divPdf} /></div>);
        }

        if (this.state.activeItem === 'September Recipes') {
            return (<div><iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/IdaFit2FitterSeptemberRecipepack.pdf&amp;embedded=true" style={divPdf} /></div>);
        }

        if (this.state.activeItem === 'October Recipes') {
            return (<div><iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/october-2020-recipe-pack1.pdf&amp;embedded=true" style={divPdf} /></div>);
        }

        return (<div><iframe className="embed-responsive-item" src="https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/BTP36WeekGuide.pdf&amp;embedded=true" style={divPdf} /></div>);
    }

    render() {
        var divLabelStyle = {
            color: 'red'
        };

        var divPdf = {
            width: '100%',
            height: '700px'
        };

        if (this.props.logins.length > 0) {
            return (
                <div>
                    <div>
                        <Label size='large' as='a' color='pink' basic circular>E-Book</Label>
                    </div>
                    <div>
                    </div>
                    <div style={divLabelStyle}>
                        <h5 color='red'>Click on the link below to read from the e-book. **Please refresh the page if the pdf file is not loaded.</h5>
                    </div>
                    <Grid celled centered>
                        <Grid.Row columns={3} color='pink'>
                            <Grid.Column >
                                <div>
                                    <a>Workouts</a>
                                </div>
                            </Grid.Column>
                            <Grid.Column >
                                <div>
                                    <a>Recipes</a>
                                </div>
                            </Grid.Column>
                            <Grid.Column >
                                <div>
                                    <a>Add Info</a>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/HomeWorkoutGuideBTP3.1.pdf&amp;embedded=true' target='_blank'>1. Home Workouts</a>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/BTP3StarterRecipePack.pdf&amp;embedded=true' target='_blank'>2. StarterPack Recipes</a>
                                </div>

                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/IdaFit2FitterSeptemberRecipepack.pdf&amp;embedded=true' target='_blank'>3. September Recipes</a>
                                </div>

                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/october-2020-recipe-pack1.pdf&amp;embedded=true' target='_blank'>4. October Recipes</a>
                                </div>

                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/november-2020-recipe-pack.pdf&amp;embedded=true' target='_blank'>5. November Recipes</a>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div>
                                    <a href='https://docs.google.com/gview?embedded=true&url=http://ingeineur-001-site1.ctempurl.com/AddictivesToAvoidCancauseHyperactiveAthmaandCancer.pdf&amp;embedded=true' target='_blank'>1. Addictives to avoid</a>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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