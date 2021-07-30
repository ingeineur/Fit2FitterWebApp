import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown, Modal, Label, Image, Container, Header, Divider, Segment } from 'semantic-ui-react'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import './signin.css';
import App from '../App';

interface IProps {
}

interface IState {
    ladies: GalleryImage[];
    apps: GalleryImage[];
}

interface GalleryImage {
    original: string,
    thumbnail: string,
    sizes: string
}

var divFooterStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    backgroundColor: '#382c2d'
};

var divLabelStyle2 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

class LandingPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            ladies: [],
            apps: []
        };
    }

    public componentDidMount() {
        let ladies: GalleryImage[] = [];
        let apps: GalleryImage[] = [];
        let i: number = 0;
        for (i = 1; i < 18; i++) {
            var img = 'ladies/img' + i + '.jpg';
            ladies.push({
                original: img,
                thumbnail: img,
                sizes: '(max-width: 200px) 200px, 80vw'
            });
        }

        for (i = 1; i < 9; i++) {
            var img = 'snapshots/img' + i + '.png';
            apps.push({
                original: img,
                thumbnail: img,
                sizes: '(max-width: 200px) 200px, 80vw'
            });
        }
        this.setState({ ladies: ladies, apps: apps });
    }

    render() {
        var divStyle2 = {
            fontFamily: 'Comic Sans MS',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        return (
            <div>
                <div>
                    <Button circular color='facebook' href='https://www.facebook.com/idafit2fitter' target='_blank' icon='facebook square' />
                    <Button circular color='instagram' href='https://www.instagram.com/idafit2fitter/' target='_blank' icon='instagram' />
                </div>
                <div style={divLabelStyle2}>
                    <Grid>
                        <Grid.Column>
                            <div id='logo'><Image src="fit2fitter_new_big_logo.png" size='big' /></div>
                        </Grid.Column>
                    </Grid>
                </div>
                <Grid centered>
                    <Grid.Row textAlign='center' />
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center' width={16}>
                            <div>
                                <h3 className="text-ida">IDA SULAIMAN</h3>
                            </div>
                            <div id='text' style={divStyle2}>
                                <h2 className='text-job'>Nutritionist & Personal Trainer</h2>
                            </div>
                            <Divider clearing />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'/>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center'>
                            <div>
                                <h3 className="text-ida">WOMEN HEALTH</h3>
                            </div>
                            <div id='text' style={divStyle2}>
                                <h2 className='text-job'>Specialist in Weight Management</h2>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='center' width={16}>
                            <Container fluid>
                                <p><h4 className='text-specialist'>Weight Loss</h4></p>
                                <p><h4 className='text-specialist'>Gain Weight/Muscles</h4></p>
                                <p><h4 className='text-specialist'>Motivational Weight</h4></p>
                                <p><h4 className='text-specialist'>Wellness</h4></p>
                                <p><h4 className='text-specialist'>Health</h4></p>
                                <p><h4 className='text-specialist'>Nutrition</h4></p>
                                <p><h4 className='text-specialist'>Nutrition for Adolescence</h4></p>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='left'>
                            <div>
                                <h3 className="text-about">About Ida</h3>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <div>
                                <Image src="profiles/ida_profile_new_3.jpg" size='small' rounded floated='right' />
                                <p>
                                    I'm Ida, a Melbourne-based qualified Australian Traditional Medicine and Counsellor.
                                    I specialise in helping people to take charge of their health and wellness through
                                    the right knowledges, supports, and nutritional advices.
                                </p>
                                <p>
                                    My passion is to educate others about the importance of food nutritions and how they affect our body health and mental well-being. 
                                    My goal is to deliver evidence-based nutritions that will help people reach their optimal 
                                    health in a manageable and sustainable manner.
                                </p>
                                <p>
                                    My philosophy in nutrition is to feed our bodies with wholesome and nutritious foods that will 
                                    help them grow naturally. I teach women how to leverage natural food's power to boost their energy, 
                                    feed their bodies, and supercharge their behaviors so they can feel great inside and out! 
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row textAlign='center'>
                        <Grid.Column textAlign='left' width={16}>
                            <div>
                                <h3 className="text-about">My Missions</h3>
                            </div>
                        </Grid.Column>
                        <Grid.Column textAlign='left' width={16}>
                            <div>
                                <Image src="profiles/ida_profile_new_2.jpg" size='small' floated='left' />
                                <p>
                                    I believe in a holistic approach to health, which considers all aspects of our physical, spiritual, mental, and emotional well-being.
                                </p>
                                <p>
                                    I've started focusing on nutrition and fitness since I had my twin boys: 
                                    Muhammad and Muadz (8 years old in 2020). 
                                    As a result, I've decided to pursue fitness and nutrition certifications. 
                                    In 2018, while completing my fitness study and nutrition research at the same time, 
                                    I assembled a group of ladies for my 1st Body Transformation Program and BANG! 
                                    Surprisingly, everyone achieved their goals! Alhamdulillah!
                                </p>
                                <p>
                                    Since then, I've made it my MISSION and launched my BTP program online from home in September 2019 just before pandemic!
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Button color='black' basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <div>
                                <h3 className="text-ida">HOW DOES IT WORK?</h3>
                                <Divider />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column width={4} textAlign='left'>
                            <h4>Step 1</h4>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <h4>LETS START THE CONVERSATION</h4>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <Icon size='big' color='orange' name='phone' />
                            <Icon size='big' color='blue' name='video camera' />
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <p>I offer a free 15-30 minute discovery call (zoom meeting) where we discuss your
                            health journey and how your diet, lifestyle and mindset may be contributing to your health.
                            This is a perfect opportunity for you to ask questions and find out if I am the right person to support you through your health journey. I promise to give you the up-to-date evidence-based advice you need and get you started on your journey to feel better within yourself.</p>

                            <p>
                                All my programs are operating online which makes it super convenient for anyone to 
                                be able to access my nutrition and fitness services. These consultations are available 
                                Australia and Malaysia wide. All you will need to do is download the free app zoom to your 
                                computer or phone and have access to internet. Its as easy as that!
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4} textAlign='left'>
                            <h4>Step 2</h4>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <h4>THE INITIAL 1:1 CONSULTATION</h4>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <Icon size='big' color='orange' name='talk' />
                            <Icon size='big' color='blue' name='write' />
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <p>Change can be challenging, but having the knowledge and understanding can make things easier.
                            Our initial 60 minute consultation includes offering personalised information and
                            counselling and therefore would be look from another person session. During this session,
                            we will:</p>

                            <p>
                                discuss and talk about your current health and medical background
                                unpack your thoughts and beliefs about food and your body
                                discuss current eating patterns and foods you like and dislike
                                discuss the bigger picture of life - where you have been, where you are not, 
                                and dig deep to understand the (why) behind your concerns
                                identify any barriers that might stand in the way of achieving your goals
                                identify the areas in life you would like to focus on
                            </p>
                            <p>
                                Together, we will create a plan to help you achieve your goals. 
                                I will provide you the tools you need to take the necessary steps to 
                                meet your goals and be your one-on-one support every step of the way. 
                                Additionally, I will provide you nutritional knowledge and lifestyle 
                                advice to help you make sustainable life-long changes for your health and wellbeing.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4} textAlign='left'>
                            <h4>Step 3</h4>
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <h4>FOLLOW UP CONSULTATION</h4>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left'>
                            <Icon size='big' color='orange' name='mail' />
                            <Icon size='big' color='blue' name='mail forward' />
                        </Grid.Column>
                        <Grid.Column width={12} textAlign='left'>
                            <p>In the follow-up sessions, we will:</p>

                            <p>I. talk about how things are going throughout your journey</p>
                            <p>II. focus on strategies, knowledge and skills to help you move towards your goals</p>
                            <p>III. discuss any obstacles you may have come across or any revelations you may have discovered about yourself</p>
                            <p>
                                It is chance to review, reflect and re-evaluate your plan 
                                and make any adjustments to priorities, goals and plans to 
                                help you move forward in improving your health and wellbeing. 
                                Together we will continue to move forward in improving your 
                                health and wellbeing to make sure that you are seeing positive results, even after completion.
                            </p>
                            <p>
                                The number of sessions you need will depend on your goals, 
                                readiness for change, what supports systems you have in 
                                place and where you relationship with food, body and mind stand. 
                                It is challenging to predict, but I will be here for you as 
                                long as you find value in our sessions and need support.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">MY SERVICES</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row color='grey' columns={2}>
                        <Grid.Column width={6}>
                            Discovery Call: FREE
                            <p><Button inverted basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                This is a 15-30 minute zoom call where we can get to know each other to see if 
                                we are the right fit. This will not involve any nutrition information or 
                                advice and will simply be an opportunity for us to get to know each other 
                                and a chance for you to ask any questions before our first consultation together.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column width={6}>
                            <p>1 ON 1 CONSULTATION PACKAGE: A$450</p>
                            <p>Price options:</p>
                            <p>One time payment: $450</p>
                            <p>Monthly payments of: $150.00 for 3 months</p>
                            <p><Button color='black' basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                This package will provide you with all the tools to start living the life you truly want.
                            </p>
                            <p>
                                Over 3 months we will have 6 session of one on one session where we will work through mindset blocks, 
                                creating a healthy relationship with food, making lifestyle changes to 
                                create a more holistic life and most importantly how to use the power of 
                                food to improve your energy, nourish your body and supercharge your habits 
                                to get you feeling good inside and out!
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row color='grey' columns={2}>
                        <Grid.Column width={6}>
                            INITIAL CONSULTATION: A$100
                            <p><Button inverted basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                These initial consultations will be one hour in time and the goal 
                                of these consultations is to ensure each individual client is provided 
                                with sustainable and effective lifestyle recommendations. 
                                I will work with you to set small achievable goals that you 
                                can use to kick start your health and wellness journey.
                            </p>
                            <p>
                                My philosophy is based on embracing a wholefood nutrient dense nutrition plan.
                                The aim is to provide individual treatment plans tailored to individual concerns, 
                                goals and nutrient requirements. 
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column width={6}>
                            FOLLOW UP CONSULTATION: A$50
                            <p><Button color='black' basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                In our follow up consultations we can work together to 
                                continue expanding on your tools for living a healthy lifestyle. 
                                These sessions will be 30 minutes and we can review your goals 
                                and see if you are achieving them and if not we can re look at 
                                them to make any adjustments to make them more achievable. 
                                Once you have achieved one goal we can continue to dive deeper 
                                into creating a healthy maintainable lifestyle.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row color='grey' columns={2}>
                        <Grid.Column width={6}>
                            CALORIE, MACRO, AND PORTION GUIDE
                            A$100
                            <p><Button inverted basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                Do you want to lose weight? Gain muscle? Improve health? 
                                Boost performance? This session can help you achieve the 
                                results you want! More easily than ever before. 
                                This unique approach takes the hassle out of calorie 
                                and macro tracking, making it easier for you to lose weight, 
                                gain muscle, eat healthier, and improve your performance.
                                You'll be provided with free access to our 
                                cutting edge fitness and nutrition application to 
                                track your nutrtion intakes the smartest way.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column width={6}>
                            WORKOUT ONLY
                            A$60 MONTHLY
                            <p><Button color='black' basic href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>Let's Get Started</Button></p>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <p>
                                Online exercise classes are instructional activities 
                                that you can participate in live or watch and follow 
                                along with from the comfort of your own home, either 
                                via livestream or on-demand. You have unlimited 
                                access to all of the sessions and recorded video 
                                if the time does not suit you.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">LADIES TRANSFORMATIONS</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ImageGallery showFullscreenButton={false} items={this.state.ladies} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className="text-ida">Fit2Fitter Health & Fitness App</h3>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ImageGallery items={this.state.apps} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 } textAlign='center'>
                            <h3 className="text-ida">BOOK YOUR APPOINTMENT TODAY</h3>
                            <Divider />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <a className='text-ida' href='https://meetfox.com/en/e/fit2fitternutritionclinicbyida/1' target='_blank'>CLICK HERE</a>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Icon name='call'/> +61450686296
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Icon name='mail outline' /> idafit2fitter@gmail.com
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row/>
                </Grid>
                <footer style={divFooterStyle}> <small>&copy; Copyright 2021, Fit2Fitter by Ida</small> </footer>
            </div>
            );
    }
}

export default LandingPage;
