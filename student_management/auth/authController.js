
import { passport , User} from "./auth.js";


export const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

export const googleCallback = (req, res, next) =>
  passport.authenticate("google", { failureRedirect: "/api/vx/auth/fail" })(req, res, next);


export const authFail = (req, res) => res.status(401).send("Auth failed");

export const authenticated = (req, res) => res.json({ user: req.user });

export const logout = (req, res, next) => {
  // passport req.logout est async selon versions
  req.logout?.(err => {
    if (err) return next(err);
    req.session?.destroy?.(() => res.json({ ok: true }));
  });
};

export  function authGoogle(req,res)
{
    res.status(200).json({ user:req.user });
}

export function test(req,res)
{
    res.redirect('/api/v1/students');
}

export async function createUser(req,res)
{
    try
    {
    const {email,role}=req.body;
    await User.create({email:email,role:role});
    res.status(201).json({message:"User created"});
    }
    catch(err)
    {
        res.status(500).json({error:"Error creating user "+err.message});
    }
    
}

