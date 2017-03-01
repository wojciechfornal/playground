# VirtualBox CentOS 7 x86_64 mini
***

VirtualBox foundation for Vagrant base box. Just a basic setup to have:

- development tools
- ssh
- VirtualBox shared folder
- VirtualBox guest additions
- wget
- default user `vagrant` (with default keys)

Tweaking and hardening is supposed to be performed during provisioning.

Wojciech Fornal <wojciech.fornal@gmail.com>

## Networking

### Adapter 1

Guest NIC name: `enp0s3`

Attached to: `NAT`

Adapter Type (virtualized): `Intel PRO/1000 MT Desktop (8254OEM)`

MAC address: `08:00:27:CC:FB:4F`

This is then used as a base NIC hardware address in an exported box `Vagrantfile`:

```javascript
config.vm.base_mac = "080027CCFB4F"
```

IP address: `10.0.2.15`

Subnet mask: `255.255.255.0`

DNS: `192.168.1.1`

#### Port forwarding

| Name | Protocol | Host IP   | Host Port | Guest IP  | Guest Port |
|------|----------|-----------|-----------|-----------|------------|
| ssh  | TCP      | 127.0.0.1 | 22        | 10.0.2.15 | 22         |

Beware, during packaging with Vagrant, port forwarding gets cleared.

### Adapter 2

Guest NIC name: `enp0s8`

Attached to: `Bridged Adapter`

Host NIC: `Qualcomm Atheros AR9485WB-EG Wireless Network Adapter`

Adapter Type (virtualized): `Intel PRO/1000 MT Desktop (8254OEM)`

MAC address: `08:00:27:71:17:9D`

IP address: `issued by DHCP (eg. 192.168.1.25)`

## Serial ports

none

## Storage

### SATA port 0

- box-disk0

## USB ports

none

## Additional software

### wget

```bash
sudo yum install wget
```

## Development tools

bison, byacc, cscope, ctags, cvs, diffstat, doxygen, flex, gcc, gcc-c++, gcc-gfortran, gettext, git, indent, intltool, libtool, patch, patchutils, rcs, redhat-rpm-config, rpm-build, subversion, swig, systemtap, etc. (+ dependencies)

```bash
# clean cache
sudo yum clean all
sudo yum install "Development tools"
```
### kernel-devel

Required to build *vbox guest additions* kernel module

```bash
# check if kernel-devel sources match the running kernel
# kernel release (eg. 3.10.0-514.el7.x86_64)
uname -r
# b. list kernel-devel sources
uname -a ; rpm -qa kernel* | sort
# eventually
sudo yum install kernel-devel-$(uname -r)
```

### SSH

We'll use OpenSSH.

Install the clieant, daemon and libs (crypto).
```bash
sudo yum install openssh openssh-server openssh-clients openssh-libs
```
Backup original config file
```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

### VirtualBox

#### VirtualBox repo

This is required only if we want to install VirtualBox on a Linux host.

```bash
# vagrant/vagrant
sudo su
cd /etc/yum.repos.d
wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo
# authorize this repo
rpm --import https://www.virtualbox.org/download/oracle_vbox.asc
```

### VirtualBox guest additions

Mount *VBoxGuestAdditions.iso* in VirtualBox virtual CD drive.

*Devices > Insert Guest Additions CD image...*

Check if and how cdrom is present in devices in guest OS

```bash
ls -l /dev | grep cdrom
```

Most likely it will be available as `/dev/cdrom` or `/dev/sr0 (symlink)`

Mount the cdrom

```bash
sudo mount /dev/cdrom /media/cdrom
sudo sh /media/cdrom/VBoxLinuxAdditions.run
```

## Users

### vagrant (the default, insecure)

During OS installation, create default user (administrator) `vagrant` with password `vagrant`.

Store the default private key somewhere in the host OS. Here's the content.

```text
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzI
w+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoP
kcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2
hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NO
Td0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcW
yLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQIBIwKCAQEA4iqWPJXtzZA68mKd
ELs4jJsdyky+ewdZeNds5tjcnHU5zUYE25K+ffJED9qUWICcLZDc81TGWjHyAqD1
Bw7XpgUwFgeUJwUlzQurAv+/ySnxiwuaGJfhFM1CaQHzfXphgVml+fZUvnJUTvzf
TK2Lg6EdbUE9TarUlBf/xPfuEhMSlIE5keb/Zz3/LUlRg8yDqz5w+QWVJ4utnKnK
iqwZN0mwpwU7YSyJhlT4YV1F3n4YjLswM5wJs2oqm0jssQu/BT0tyEXNDYBLEF4A
sClaWuSJ2kjq7KhrrYXzagqhnSei9ODYFShJu8UWVec3Ihb5ZXlzO6vdNQ1J9Xsf
4m+2ywKBgQD6qFxx/Rv9CNN96l/4rb14HKirC2o/orApiHmHDsURs5rUKDx0f9iP
cXN7S1uePXuJRK/5hsubaOCx3Owd2u9gD6Oq0CsMkE4CUSiJcYrMANtx54cGH7Rk
EjFZxK8xAv1ldELEyxrFqkbE4BKd8QOt414qjvTGyAK+OLD3M2QdCQKBgQDtx8pN
CAxR7yhHbIWT1AH66+XWN8bXq7l3RO/ukeaci98JfkbkxURZhtxV/HHuvUhnPLdX
3TwygPBYZFNo4pzVEhzWoTtnEtrFueKxyc3+LjZpuo+mBlQ6ORtfgkr9gBVphXZG
YEzkCD3lVdl8L4cw9BVpKrJCs1c5taGjDgdInQKBgHm/fVvv96bJxc9x1tffXAcj
3OVdUN0UgXNCSaf/3A/phbeBQe9xS+3mpc4r6qvx+iy69mNBeNZ0xOitIjpjBo2+
dBEjSBwLk5q5tJqHmy/jKMJL4n9ROlx93XS+njxgibTvU6Fp9w+NOFD/HvxB3Tcz
6+jJF85D5BNAG3DBMKBjAoGBAOAxZvgsKN+JuENXsST7F89Tck2iTcQIT8g5rwWC
P9Vt74yboe2kDT531w8+egz7nAmRBKNM751U/95P9t88EDacDI/Z2OwnuFQHCPDF
llYOUI+SpLJ6/vURRbHSnnn8a/XG+nzedGH5JGqEJNQsz+xT2axM0/W/CRknmGaJ
kda/AoGANWrLCz708y7VYgAtW2Uf1DPOIYMdvo6fxIB5i9ZfISgcJ/bbCUkFrhoH
+vq/5CIWxCPp0f85R4qxxQ5ihxJ0YDQT9Jpx4TMss4PSavPaBH3RXow5Ohe+bYoQ
NE5OgEXk2wVfZczCZpigBKbKZHNYcelXtTt/nP3rsCuGcM4h53s=
-----END RSA PRIVATE KEY-----
```
Store the following public key in `~/.ssh/vagrant.pub`

```text
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ== vagrant insecure public key
```

## Checks and diagnostics

### VirtualBox shared folder and guest addition

You can use `lsmod`

```bash
lsmod | grep vbox

# it should output something like:
# vboxsf                 39741  0
# vboxguest             297222  2 vboxsf
```
This means that both *VirtualBox shared folder* kernel module and *VirtualBox guest additions* kernel modules are loaded.

or simply `grep` the `/proc/modules` for a bit more detailed info

```bash
cat /proc/modules | grep vbox

# it should output something like:
# vboxsf 39741 0 - Live 0xffffffffa030a000 (OE)
# vboxguest 297222 2 vboxsf, Live 0xffffffffa0261000 (OE)
```

### SSH

As the default output contains data we do not necessarily need to guess whether ssh daemon is running, we'll limit the otuput to first 3 lines.

```bash
service sshd status | head -n3

# it should output something like:
# ● sshd.service - OpenSSH server daemon
#   Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; vendor preset: enabled)
#   Active: active (running) since Wed 2017-03-01 11:53:07 EST; 22min ago
```

### Insecure services

- telnet
- rsh / rlogin (remote shell access / remote login)
- rcp (remote file copy)
- vsftpd

Check if you can connect via telnet (port 23) from the host machine

```bash
telnet [guest_ip]
```

If not, then fine. If yes, then remove telnet-server package.

Now query for remaining packages and remove when necessary.

```bash
rpm -qa | grep -i [package_name]
```

Where [package_name]: rsh, rlogin, rcp, vsftpd
