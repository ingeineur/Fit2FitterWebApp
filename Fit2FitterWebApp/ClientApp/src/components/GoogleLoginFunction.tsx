import * as React from 'react';
import { googleLogout, useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { Button, Icon, Modal, Header, Image } from 'semantic-ui-react'

interface IProps {
    date: Date;
    updateGoogleFitEntries: Function;
}

interface IHealth {
    type: string,
    value: number[]
}

export function GoogleLoginFunction(props: IProps) {
    const [user, setUser] = React.useState("");
    const [expiry, setExpiry] = React.useState(0);
    const [profile, setProfile] = React.useState({ picture: "", email: "", name: "" });
    const [open, setOpen] = React.useState(true);

    const dataValues = [
        {
            "title": "Calories",
            "type": "com.google.calories.expended"
        },
        {
            "title": "Heart",
            "type": "com.google.heart_rate.bpm"
        },
        {
            "title": "Steps",
            "type": "com.google.step_count.delta"
        }
    ];

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.heart_rate.read',
        onSuccess: (codeResponse) => {
            setUser(codeResponse.access_token);
            setExpiry(new Date().getTime() + codeResponse.expires_in * 1000);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setProfile({ name: "", email: "", picture: "" });
    };

    const getDailyData = async () => {
        var date = new Date(props.date);
        date.setHours(24, 0, 0, 0);

        var states: IHealth[] = [];
        let promises: any[] = [];
        var fetchStr = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
        dataValues.forEach(dataType => {
            var promise = fetch(fetchStr,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${user}`,
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        "aggregateBy": [{
                            "dataTypeName": dataType.type
                        }],
                        "bucketByTime": {
                            "durationMillis": 86400000
                        },
                        "endTimeMillis": date.getTime(),
                        "startTimeMillis": date.getTime() - (1 * 86400000)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    var state: IHealth = { type: dataType.type, value: [] };
                    for (let idx = 0; idx < data.bucket.length; idx++) {
                        data.bucket[idx].dataset[0].point.forEach((point: { value: any[]; }) => {
                            point.value.forEach((val) => {
                                let extract = val['intVal'] || Math.ceil(val['fpVal']) || 0;
                                //console.log(extract);
                                state.value.push(extract);
                            })
                        })
                    }
                    states.push(state);
                })
                .catch((err) => console.log(err));
            promises.push(promise);
        });
        
        Promise.all(promises).then(() => {
            //console.log(states);
            props.updateGoogleFitEntries(states);
            return;
        })
    } 

    React.useEffect(
        () => {
            setOpen(false);
            if (user) {
                getDailyData();
                
                //var fetchStr = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + user;
                //fetch(fetchStr,
                //    {
                //        method: 'GET',
                //        headers: {
                //            Authorization: `Bearer ${user}`,
                //            Accept: 'application/json'
                //        }
                //    })
                //    .then(res => res.json())
                //    .then(data => {
                //        setProfile({ name: data['name'], email: data['email'], picture: data['picture'] });
                //        console.log(data);
                //    })
                //    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    return (
        <div>
            { new Date().getTime() < expiry ?(
                <div>
                    <Button labelPosition='left' basic icon size='tiny' onClick={() => getDailyData()} ><Icon inverted size='large' name='google' color='blue' />Fetch</Button>
                </div>
            ) : (
                    <div>
                        <Button color='grey' labelPosition='left' basic icon size='tiny' onClick={() => login()} ><Icon inverted size='large' name='checkmark' color='blue' />Fetch</Button>
                    </div>              
            )}
        </div>
    );
}
