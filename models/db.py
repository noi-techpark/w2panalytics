MIGRATE=True
db = DAL('sqlite://storage.sqlite', pool_size=1, check_reserved=['all'],
	migrate=MIGRATE,
	migrate_enabled=MIGRATE,
	#fake_migrate_all=True,
	lazy_tables=not(MIGRATE)
)
from gluon.tools import Auth
auth = Auth(db)
auth.define_tables(username=True, migrate=MIGRATE)

## configure email
mail = auth.settings.mailer
mail.settings.server = 'smtp.digital.tis.bz.it:25'
mail.settings.sender = 'project@integreen-life.bz.it'
#mail.settings.login = 'username:password'

## configure auth policy
auth.settings.registration_requires_verification = False
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = True
#auth.settings.actions_disabled.append('register')
