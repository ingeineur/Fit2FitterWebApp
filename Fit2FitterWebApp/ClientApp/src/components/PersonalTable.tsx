import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Input, Grid, Dropdown, Image, Loader, Dimmer, Radio } from 'semantic-ui-react';
import RangeSlider from 'react-bootstrap-range-slider';
import { IPersonal } from '../models/clients'

var divLabelStyle = {
    color: 'blue',
    fontSize: '10px',
    verticalAlign: 'middle'
};

interface IProps {
    personal: IPersonal;
    update: boolean;
    type: string;
    updatePersonal: Function
}

interface IState {
    updated: boolean;
    dirty: boolean;
    name: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number;
    imageUploadStatus: string;
    photo: string;
}

class PersonalTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            updated: false, name: '', age: 0,
            height: 0.0, weight: 0.0, targetWeight: 0.0, dirty: false, imageUploadStatus: 'No Image',
            photo: ''
        };
    }

    public componentDidMount() {
        var imageStatus = '';
        if (this.props.personal.avatar !== '') {
            imageStatus = 'Uploaded'
        }

        this.setState({
            imageUploadStatus: imageStatus,
            name: this.props.personal.name,
            age: this.props.personal.age,
            height: this.props.personal.height
        });
    }

    handleImageChange = (event: any) => {
        const formData = new FormData()
        formData.append('Filename', event.target.files[0]['name'])
        formData.append('FormFile', event.target.files[0])
        this.setState({ imageUploadStatus: 'Uploading..' });

        fetch('api/Utilities/image/avatar/upload',
            {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(uploadedFilename => {
                console.log(uploadedFilename)
                this.setState({ photo: uploadedFilename, updated: true, imageUploadStatus: 'Uploaded' });
            })
            .catch(error => {
                console.error(error)
            })
    }

    getUploadImageColour = () => {
        if (this.state.imageUploadStatus.includes('Uploading')) {
            return 'orange';
        }

        if (this.state.imageUploadStatus.includes('No Image')) {
            return 'black';
        }

        return 'green';
    }

    updateName = (event: any) => {
        this.setState({ name: event.target.value, updated: true });
    }

    updateAge = (event: any) => {
        if (isNaN(parseInt(event.target.value))) {
            this.setState({ age: 0, updated: true });
            return;
        }

        this.setState({ age: parseInt(event.target.value), updated: true });
    }

    updateHeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ height: event.target.value, updated: true });
        }
    }

    updateWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ weight: event.target.value, updated: true });
        }
    }

    updateTargetWeight = (event: any) => {
        const re = /^[-+,0-9,\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ targetWeight: event.target.value, updated: true });
        }
    }

    getColor = (percent: number) => {
        if (percent < 100.00) {
            return 'red';
        }

        return 'green';
    }

    getPhoto = () => {
        if (this.state.photo !== '') {
            return (<Segment size='tiny' attached='top' textAlign='center'><Image src={'/images/avatars/' + this.state.photo} size='medium' /></Segment>);
        }
        return;
    }

    isLoadingData = () => {
        return (this.state.imageUploadStatus.includes('Uploading')); 
    }

    render() {
        var divUploadImageStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getUploadImageColour()
        };

        if (this.props.update !== this.state.dirty)
        {
            var imageStatus = '';
            if (this.props.personal.avatar !== '') {
                imageStatus = 'Uploaded'
            }
            console.log('updating total values');
            this.setState({
                imageUploadStatus: imageStatus,
                photo: this.props.personal.avatar,
                name: this.props.personal.name,
                age: this.props.personal.age,
                height: this.props.personal.height,
                weight: this.props.personal.weight,
                targetWeight: this.props.personal.targetWeight,
                dirty: !this.state.dirty
            });
        }

        if (this.state.updated === true) {
            this.setState({ updated: false });
            this.props.updatePersonal({
                avatar: this.state.photo, name: this.state.name, age: this.state.age,
                height: this.state.height, weight: this.state.weight, targetWeight: this.state.targetWeight,
                activityLevel: this.props.personal.activityLevel, macroType: this.props.personal.macroType,
                carbPercent: this.props.personal.carbPercent, proteinPercent: this.props.personal.proteinPercent, fatPercent: this.props.personal.fatPercent,
                carbWeight: this.props.personal.carbWeight, proteinWeight: this.props.personal.proteinWeight, fatWeight: this.props.personal.fatWeight, manualMacro: this.props.personal.manualMacro
            });
        }

        if (this.isLoadingData()) {
            return (<div style={divUploadImageStyle}>
                <Dimmer active inverted>
                    <Loader content='Uploading Image...' />
                </Dimmer>
            </div>);
        }

        return (
            <Grid centered>
                <Grid.Row columns={2} stretched>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        {this.getPhoto()}
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <div>
                            <a>Photo</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <div>
                            <div style={divUploadImageStyle}>
                                <a>{this.state.imageUploadStatus}</a>
                            </div>
                            <input
                                type='file'
                                accept="image/*"
                                onChange={this.handleImageChange}
                            />
                        </div>
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Name</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.name} placeholder='Name' onChange={this.updateName} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Age</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.age} placeholder='Age' onChange={this.updateAge} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Height</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.height} placeholder='Height' onChange={this.updateHeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.weight} placeholder='Weight' onChange={this.updateWeight} />
                    </Grid.Column>
                    <Grid.Column as='a' width={4} textAlign='left' verticalAlign='middle'>
                        <a>Target Weight</a>
                    </Grid.Column>
                    <Grid.Column width={12} textAlign='left' verticalAlign='middle'>
                        <Input as='a' size='mini' value={this.state.targetWeight} placeholder='Weight' onChange={this.updateTargetWeight} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(PersonalTable);