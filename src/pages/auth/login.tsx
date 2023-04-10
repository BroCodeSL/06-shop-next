import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from "@/components";
import { validations } from '@/utils';

type FormData = {
  email   : string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then( prov => {
      setProviders(prov);
    })
  }, [])
  

  const onLoginUser: SubmitHandler<FormData> = async ({ email, password }) => {
    setShowError(false);

    await signIn('credentials', { email, password });
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
        <Box sx={{ width: 350, p: '10px 20px'}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">Login</Typography>
              <Chip
                label="We don't recognize that user/password"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none', mt: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Email"
                variant="filled"
                fullWidth
                { ...register('email', {
                  required: 'This field is required',
                  validate: validations.isEmail
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                { ...register('password', {
                  required: 'This field is required',
                  minLength: { value: 6, message: 'Min 6 characters' }
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <Link
                href={ router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register' }
                component={ NextLink }
                color="text.primary"
                underline='always'
              >
                do not you have an account?
              </Link>
            </Grid>

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />
                {
                  Object.values( providers ).map((provider: any) => {

                    if ( provider.id === 'credentials') return (<div key="credentials"></div>)

                    return (
                      <Button
                        key={provider.id}
                        variant="outlined"
                        fullWidth
                        color="primary"
                        sx={{ mb: 1 }}
                        onClick={() => signIn(provider.id)}
                      >
                        { provider.name }
                      </Button>
                    )
                  })
                }
            </Grid>   
          </Grid>

        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { p = '/' } = query;

  if ( session ) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default LoginPage
