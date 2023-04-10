import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '@/context';
import { AuthLayout } from "@/components"
import { validations } from '@/utils';

type FormData = {
  name    : string;
  email   : string;
  password: string;
};

const RegisterPage = () => {

  const router = useRouter();
  const { registerUser } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterUser: SubmitHandler<FormData> = async ({ name, email, password }) => {
    setShowError(false);
    const { hasError, message } = await registerUser( name, email, password );
    if ( hasError ) {
      setShowError(true);
      setErrorMessage( message || '' );
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    await signIn('credentials', { email, password });
  }

  return (
    <AuthLayout title="Register">
      <form onSubmit={ handleSubmit(onRegisterUser) } noValidate>
        <Box sx={{ width: 350, p: '10px 20px'}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">Create account</Typography>
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
                type="text"
                label="Full name"
                variant="filled"
                fullWidth
                { ...register('name', {
                  required: 'This field is required',
                  minLength: { value: 2, message: 'Min 2 characters' }
                })}
                error={ !!errors.name }
                helperText={ errors.name?.message }
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
                Sign up
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <Link
                href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login' }
                component={NextLink}
                color="text.primary"
                underline='always'
              >
                do you have an account?
              </Link>
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

export default RegisterPage;