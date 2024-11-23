import { Link, useSearchParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Logo from 'components/logo';
import useAuth from 'hooks/useAuth';
import AuthSocButton from 'sections/auth/AuthSocButton';
import AuthDivider from 'sections/auth/AuthDivider';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// assets
import imgFacebook from 'assets/images/auth/facebook.svg';
import imgTwitter from 'assets/images/auth/twitter.svg';
import imgGoogle from 'assets/images/auth/google.svg';
import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const { isLoggedIn } = useAuth();

  let [searchParams, setSearchParams] = useSearchParams();
  const [hash, setHash] = useState(searchParams.get("hash"))
  const [device_token, setdevice_token] = useState('')
  useEffect(() => {
    async function fetchDeviceToken() {
      try {
        const token = window.device_token || localStorage.getItem('device_token') || 'f3768d22a95d0581';

        console.log('Fetched Device Token:', token);
        setdevice_token(token);
      } catch (error) {
        console.error('Failed to fetch device token:', error);
      }
    }
    fetchDeviceToken();
  }, []);

  return !hash
    ?
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          {/* <Logo /> */}
          <Image style={{ margin: "10px 0px 0px 0px" }} width={150} height={150} src={'/assets/images/lrLogo.png'}></Image>
        </Grid>





        {/* <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <AuthSocButton>
                <img src={imgFacebook} alt="Facebook" style={{ margin: '0 10px' }} /> Sign In with Facebook
              </AuthSocButton>
            </Grid>
            <Grid item xs={12}>
              <AuthSocButton>
                <img src={imgTwitter} alt="Facebook" style={{ margin: '0 10px' }} /> Sign In with Twitter
              </AuthSocButton>
            </Grid>
            <Grid item xs={12}>
              <AuthSocButton>
                <img src={imgGoogle} alt="Facebook" style={{ margin: '0 10px' }} /> Sign In with Google
              </AuthSocButton>
            </Grid>
          </Grid>
        </Grid>F
        <Grid item xs={12}>
          <AuthDivider>
            <Typography variant="body1">OR</Typography>
          </AuthDivider>
        </Grid> */}
        {device_token !== '' ? <> <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
          <Grid item xs={12}>
            <AuthLogin forgot="/auth/forgot-password" />
          </Grid></> : <Grid item xs={12} sx={{ textAlign: 'center' }}>

          <Typography variant="h5" sx={{
            margin: "20px 0", background: "green", padding: "13px 13px"
            , borderRadius: "9px", fontSize: "20px"
          }}> <a href="/upittech.apk" download style={{ textDecoration: 'none', color: '#fff' }}>Download our app now</a></Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <a href="/upittech.apk" download style={{ textDecoration: 'none' }}>
              <img
                src="/assets/images/Google-Play-and-App-Store-Button-Logo-White-Vector.png"
                alt="Download App"

              />
            </a>
          </Stack>
        </Grid>}
      </Grid>
    </AuthWrapper>
    : ""
}
