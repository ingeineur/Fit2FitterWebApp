import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Loader, Dimmer } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MacroGuideReviewModal from './MacroGuideReviewModal'
import { IClientDto } from '../models/clients';
import AppsMenu from './AppMenus';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    selectedDate: Date;
    prevDate: Date;
    clientDtos: IClientDto[];
    clientDtosUpdated: boolean;
    updated: boolean;
    dateChanged: boolean;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class MacroGuideDashboard extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        
        if (this.props.logins.length > 0) {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            this.setState({ selectedDate: date, prevDate: date });

            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, clientDtosUpdated: true
                })).catch(error => console.log(error));
        }
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            updated: false,
            clientDtos: [],
            clientDtosUpdated: false,
            dateChanged: false
        };
    }
    
    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), dateChanged: true})
        }
    }

    handlePrevDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();
        
        date.setDate(day - 1);
        date.setHours(0, 0, 0, 0);

        if (date.getDate() > day) {
            date.setMonth(month - 1);
        }

        if (date.getMonth() > month) {
            date.setFullYear(year - 1);
        }

        this.setState({ selectedDate: new Date(date), prevDate: prevDate, dateChanged: true});
    }

    handleNextDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();

        date.setDate(day + 1);
        date.setHours(0, 0, 0, 0);

        if (date.getDate() < day) {
            date.setMonth(month + 1);
        }

        if (date.getMonth() < month) {
            date.setFullYear(year + 1);
        }

        this.setState({ selectedDate: new Date(date), prevDate: prevDate, dateChanged: true});
    }

    isLoadingData = () => {
        if (!this.state.clientDtosUpdated) {
            return true;
        }

        return false;
    }

    render() {
        var divDateStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.dateChanged) {
                this.setState({ dateChanged: false, updated: !this.state.updated });
            }

            return (
                <div>
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <AppsMenu activeParentItem='Nutritions' activeItem='MealReview' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                            </Grid.Column>
                            <Grid.Column width={16} verticalAlign='middle'>
                                <Segment attached='top'>
                                    <div style={divDateStyle}>
                                        <Button className='prev' onClick={this.handlePrevDate} attached='left' icon='chevron left' />
                                        <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                                        <Button className='next' onClick={this.handleNextDate} attached='right' icon='chevron right' />
                                    </div>
                                </Segment>
                                <Segment textAlign='center' attached='bottom'>
                                    <MacroGuideReviewModal senderId={this.props.logins[0].clientId} clientId={this.props.logins[0].clientId} mealDate={this.state.selectedDate.toISOString()} update={this.state.updated} />
                                </Segment>
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
)(MacroGuideDashboard as any);