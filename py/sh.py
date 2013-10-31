# a simple wrapper that encapsulates shell calls
import sys, os;
import subprocess;

class Sh(object):
  def cmd_closure(self, name):
    def closure(*args, **kwargs):
      sh_args = [name];
      for x in args:
        sh_args.append(str(x));
      return subprocess.call(sh_args, **kwargs);
    return closure;
  def __getattr__(self, name):
    return self.cmd_closure(name);

sh = Sh();
