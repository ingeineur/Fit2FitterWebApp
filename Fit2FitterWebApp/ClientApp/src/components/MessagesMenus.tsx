import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Icon, Menu, Label, Dimmer, Loader } from 'semantic-ui-react'
import { IClientDto, LoginDto } from '../models/clients';
import { IMessageDto } from '../models/messages';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import './signin.css';

interface IProps {
}

interface IState {
    activeItem: string;
    unReadMessage: number;
    unReadMessageMeals: number;
    unReadMessageMeasurements: number;
    messageDtos: IMessageDto[];
    messagesUpdated: boolean;
    messageMealsDtos: IMessageDto[];
    mealMessagesUpdated: boolean;
    messageMeasurementsDtos: IMessageDto[];
    measurementMessagesUpdated: boolean;
    clientUpdated: boolean;
    toClientId: number;
    fetchAllData: boolean;
    clientDtos: IClientDto[];
}

type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested

class MessagesMenus extends React.Component<LoginProps, IState > {

    fetchAllData = () => {
        //get client info
        fetch('api/client?clientId=' + this.props.logins[0].clientId)
            .then(response => response.json() as Promise<IClientDto[]>)
            .then(data => this.setState({
                clientDtos: data, clientUpdated: true
            })).catch(error => console.log(error));

        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageDtos: data, messagesUpdated: true, unReadMessage: data.length
            })).catch(error => console.log(error));

        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/meals?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMealsDtos: data, mealMessagesUpdated: true, unReadMessageMeals: data.length
            })).catch(error => console.log(error));

        var date = new Date();
        date.setHours(0, 0, 0, 0);
        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/measurements?dateString=' + date.toISOString() + '&readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMeasurementsDtos: data, measurementMessagesUpdated: true, unReadMessageMeasurements: data.length
            })).catch(error => console.log(error));
    }

    public componentDidMount() {
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            activeItem: '',
            messageDtos: [],
            messagesUpdated: false,
            unReadMessage: 0,
            unReadMessageMeals: 0,
            clientUpdated: false,
            toClientId: 2,
            messageMealsDtos: [],
            mealMessagesUpdated: false,
            messageMeasurementsDtos: [],
            measurementMessagesUpdated: false,
            unReadMessageMeasurements: 0,
            fetchAllData: false,
            clientDtos: []
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getAdmin = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Master'
                    onClick={this.handleItemClick}>
                    <Icon color='olive' name='power' />
                    Master View
                    </Menu.Item>);
        }
    }

    getMealsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Meals Logger (Admin)'
                    onClick={this.handleItemClick}>
                    <Icon name='clipboard outline' />
                    <div>Meals</div><div>Logs</div>
                    <Label color='red' floating>
                        {this.state.unReadMessageMeals}
                    </Label>
                </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Meals Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline' />
                <div>Meals</div><div>Logs</div>
                <Label color='red' floating>
                    {this.state.unReadMessageMeals}
                </Label>
            </Menu.Item>
        );
    }

    getMeasurementsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Measurements Logger Admin'
                    onClick={this.handleItemClick}>
                    <Icon name='clipboard outline'/>
                    <div>Measurements</div><div>Logs</div>
                    <Label color='red' floating>
                        {this.state.unReadMessageMeasurements}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Measurements Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline'/>
                <div>Measurements</div><div>Logs</div>
                <Label color='red' floating>
                    {this.state.unReadMessageMeasurements}
                </Label>
                </Menu.Item>
        );
    }

    getMealsReviewByDate = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu fluid vertical icon='labeled' color='teal' inverted>
                    <Menu.Item
                        name='Meals Logger by Date (Admin)'
                        onClick={this.handleItemClick}>
                        <Icon name='clipboard outline'/>
                        Logged Meals by Date
                        <Label color='red' floating>
                            {this.state.unReadMessageMeals}
                        </Label>
                    </Menu.Item>
                </Menu>);
        }
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (!this.state.fetchAllData) {
                this.fetchAllData();
                this.setState({ fetchAllData: true });
            }

            if (!this.state.messagesUpdated ||
                !this.state.mealMessagesUpdated ||
                !this.state.measurementMessagesUpdated ||
                !this.state.clientUpdated) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }

            if (this.state.activeItem === 'Messages') {
                return (<Redirect to="/messages" />);
            }

            if (this.state.activeItem === 'Meals Logger') {
                return (<Redirect to="/messagesmeals" />);
            }

            if (this.state.activeItem === 'Meals Logger (Admin)') {
                return (<Redirect to="/messagesmealsadmin" />);
            }

            if (this.state.activeItem === 'Meals Logger by Date (Admin)') {
                return (<Redirect to="/messagesmealsadminbydate" />);
            }

            if (this.state.activeItem === 'Measurements Logger') {
                return (<Redirect to="/messagesmeasurements" />);
            }

            if (this.state.activeItem === 'Measurements Logger Admin') {
                return (<Redirect to="/messagesmeasurementsadminbydate" />);
            }

            return (
                <div>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column>
                                <Menu fluid vertical icon='labeled' color='green' inverted>
                                    {this.getMealsReview()}
                                </Menu>
                                {this.getMealsReviewByDate()}
                                <Menu fluid vertical icon='labeled' color='teal' inverted>
                                    {this.getMeasurementsReview()}
                                </Menu>
                                <Menu fluid vertical icon='labeled' color='blue' inverted>
                                    <Menu.Item
                                        name='Messages'
                                        onClick={this.handleItemClick}>
                                        <Icon name='mail' />
                                        <div>Messages</div><div>Inbox</div>
                                        <Label color='red' floating>
                                            {this.state.unReadMessage}
                                        </Label>
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>);
        }
        return (<Redirect to="/" />);
    }
}

export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(MessagesMenus as any);
