import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Label, Icon, Divider, Segment, Button } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { RouteComponentProps } from 'react-router';
import AppsMenu from './AppMenus';
import { IClientDto } from '../models/clients';

interface IProps {
}

interface IState {
    activeItem: string;
    recipeText: string
    username: string;
    password: string;
    clients: IClientDto[];
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
        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clients: data
                })).catch(error => console.log(error));
        }
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '', activeItem: 'BTPGuide', recipeText: 'StarterPack Recipes', clients:[]
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    onSelectionChanged = (e: any, value: any) => {
        console.log(value['value']);
        this.setState({ activeItem: value['value'], recipeText: value['value'] })
    }

    render() {
        var divLabelStyle = {
            color: 'red'
        };

        var divLabelStyle2 = {
            color: 'black',
            backgroundColor: 'yellow'
        };

        if (this.props.logins.length > 0) {
            return (
                <div>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <AppsMenu activeParentItem='EBook' activeItem='EBook' logins={this.props.logins} clientDtos={this.state.clients} />
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <div style={divLabelStyle}>
                                    <h5 color='red'>Click on the link below to read from the e-book. **Please refresh the page if the pdf file is not loaded.</h5>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <Segment>
                                    <Grid centered>
                                        <Grid.Row divided columns={3} color='pink'>
                                            <Grid.Column >
                                                <div>
                                                    <a>BTP2021/1 (Completed)</a>
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
                                        <Grid.Row divided columns={3}>
                                            <Grid.Column>
                                                <div>
                                                    <Button disabled fluid basic color='blue'>
                                                        <Icon color='yellow' name='star' corner='top left' />
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/btp2021book1.pdf&amp;embedded=true' target='_blank'>Calorie, Macro & Portion Guide (Book 1)</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button disabled fluid basic color='green'>
                                                        <Icon color='yellow' name='star' corner='top left' />
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/btp2021book2.pdf&amp;embedded=true' target='_blank'>Nutrition Weekly Challenge 2021 (Book 2)</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button disabled fluid basic color='black'>
                                                        <Icon color='yellow' name='star' corner='top left' />
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/btp2021book3.pdf&amp;embedded=true' target='_blank'>Workout Weekly Challenge 2021 (Book 3)</a>
                                                    </Button>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div>
                                                    <Button fluid basic color='blue'>
                                                        <Icon color='yellow' name='star' corner='top left' />
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/BTP3StarterRecipePack.pdf&amp;embedded=true' target='_blank'>StarterPack Recipes</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/IdaFit2FitterSeptemberRecipepack.pdf&amp;embedded=true' target='_blank'>Sep 2020</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/october-2020-recipe-pack1.pdf&amp;embedded=true' target='_blank'>Oct 2020</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/november-2020-recipe-pack.pdf&amp;embedded=true' target='_blank'>Nov 2020</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/december-2020-recipe-pack.pdf&amp;embedded=true' target='_blank'>Dec 2020</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/january-2021-recipe-pack.pdf&amp;embedded=true' target='_blank'>Jan 2021</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/february-2021-recipe-pack.pdf&amp;embedded=true' target='_blank'>Feb 2021</a>
                                                    </Button>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/AddictivesToAvoidCancauseHyperactiveAthmaandCancer.pdf&amp;embedded=true' target='_blank'>Addictives to Avoid</a>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button fluid basic color='green'>
                                                        <a href='https://docs.google.com/gview?embedded=true&url=http://idafit2fitter.com/immunity-support-pack.pdf&amp;embedded=true' target='_blank'>Immunity Support Pack</a>
                                                    </Button>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
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