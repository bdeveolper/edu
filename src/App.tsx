import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  Filter,
  FileText,
  GripVertical,
  Headphones,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MonitorPlay,
  MoreHorizontal,
  Moon,
  PenLine,
  Play,
  Plus,
  QrCode,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Wallet,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react"

type View = "dashboard" | "curriculum" | "groups" | "attendance" | "questions" | "reports" | "student-home" | "student-courses" | "student-exam" | "student-qr" | "parent-home" | "parent-attendance" | "parent-payments" | "support"
type Portal = "public" | "auth" | "signup" | "instructor" | "student" | "parent"
type Theme = "light" | "dark"
type ModalType = "course" | "lesson" | "group" | "add-student" | "support-ticket" | "manual-attendance" | "question" | "exam" | "withdraw" | "export" | "profile" | "course-details" | "recharge" | "filter" | "payment-details" | "excuse" | null

type NavItem = { id: View; label: string; description: string; icon: LucideIcon }
type ParentChildId = "omar" | "salma"
type ParentChildProfile = {
  name: string
  grade: string
  average: number
  averageChange: string
  attendance: number
  attendanceChange: string
  lessonsCompleted: number
  totalLessons: number
  learningHours: number
  learningChange: string
  scorePath: string
  scoreEndpoint: number
  attendedDays: number[]
  absentDays: number[]
  onlineDays: number[]
  subjects: [string, number, string][]
}
type ParentPaymentDetails = {
  description: string
  student: string
  date: string
  method: string
  amount: string
}
type ExcuseDetails = {
  student: string
  date: string
  lesson: string
}
type StudentExamAttempt = {
  score: number
  answers: Record<number, number>
}

const navigation: NavItem[] = [
  {
    id: "dashboard",
    label: "اللوحة الرئيسية",
    description: "نظرة شاملة",
    icon: LayoutDashboard,
  },
  {
    id: "curriculum",
    label: "بناء المناهج والدروس",
    description: "المحتوى التعليمي",
    icon: BookOpen,
  },
  {
    id: "groups",
    label: "إدارة المجموعات والسناتر",
    description: "الجداول والسعة",
    icon: Users,
  },
  {
    id: "attendance",
    label: "تسجيل الحضور المباشر",
    description: "QR والحضور اليدوي",
    icon: QrCode,
  },
  {
    id: "questions",
    label: "بنك الأسئلة والامتحانات",
    description: "الاختبارات والتصحيح",
    icon: PenLine,
  },
  {
    id: "reports",
    label: "التقارير والمالية",
    description: "الأداء والتسويات",
    icon: BarChart3,
  },
  {
    id: "support",
    label: "مركز الدعم",
    description: "الأسئلة والاستفسارات",
    icon: Headphones,
  },
]

const studentNavigation: NavItem[] = [
  {
    id: "student-home",
    label: "الرئيسية",
    description: "تقدمك اليوم",
    icon: Home,
  },
  {
    id: "student-courses",
    label: "دوراتي ودروسي",
    description: "المحتوى التعليمي",
    icon: BookOpen,
  },
  {
    id: "student-exam",
    label: "الاختبارات",
    description: "الاختبارات والنتائج",
    icon: PenLine,
  },
  {
    id: "student-qr",
    label: "بطاقة الطالب والمحفظة",
    description: "الحضور والاشتراك",
    icon: QrCode,
  },
  {
    id: "support",
    label: "مركز الدعم",
    description: "المساعدة والاستفسارات",
    icon: Headphones,
  },
]

const parentNavigation: NavItem[] = [
  {
    id: "parent-home",
    label: "متابعة الأداء",
    description: "ملخص مستوى الطالب",
    icon: Activity,
  },
  {
    id: "parent-attendance",
    label: "الحضور والغياب",
    description: "التقويم الشهري",
    icon: CalendarDays,
  },
  {
    id: "parent-payments",
    label: "المدفوعات",
    description: "الفواتير والاشتراكات",
    icon: ReceiptText,
  },
  {
    id: "support",
    label: "مركز الدعم",
    description: "المساعدة والاستفسارات",
    icon: Headphones,
  },
]

const format = new Intl.NumberFormat("ar-EG")

const parentChildren: Record<ParentChildId, ParentChildProfile> = {
  omar: {
    name: "عمر أحمد",
    grade: "الصف الثالث الثانوي",
    average: 86,
    averageChange: "+8.2%",
    attendance: 94,
    attendanceChange: "+3.1%",
    lessonsCompleted: 18,
    totalLessons: 24,
    learningHours: 12.5,
    learningChange: "+2.4 ساعة",
    scorePath: "M0 215 C110 200 175 100 280 130 S460 55 700 64",
    scoreEndpoint: 64,
    attendedDays: [3, 5, 9, 16, 23, 26, 30],
    absentDays: [12],
    onlineDays: [6, 19],
    subjects: [
      ["الفيزياء", 92, "ممتاز"],
      ["الرياضيات", 84, "جيد جداً"],
      ["الكيمياء", 76, "جيد"],
      ["اللغة العربية", 88, "جيد جداً"],
    ],
  },
  salma: {
    name: "سلمى أحمد",
    grade: "الصف الأول الثانوي",
    average: 91,
    averageChange: "+5.6%",
    attendance: 89,
    attendanceChange: "+1.8%",
    lessonsCompleted: 15,
    totalLessons: 20,
    learningHours: 9.8,
    learningChange: "+1.6 ساعة",
    scorePath: "M0 205 C110 180 175 145 280 105 S460 95 700 48",
    scoreEndpoint: 48,
    attendedDays: [2, 4, 8, 11, 15, 18, 22, 25, 29],
    absentDays: [14],
    onlineDays: [7, 21],
    subjects: [
      ["الفيزياء", 88, "جيد جداً"],
      ["الرياضيات", 94, "ممتاز"],
      ["الكيمياء", 90, "ممتاز"],
      ["اللغة العربية", 86, "جيد جداً"],
    ],
  },
}

function Brand({ compact = false }: { compact?: boolean }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      {logoFailed ? (
        <div className="brand-fallback" role="img" aria-label="B Developer Logo">
          B
        </div>
      ) : (
        <img
          src="/b-developer-logo.jpeg"
          alt="B Developer Logo"
          className="h-10 w-auto object-contain"
          onError={() => setLogoFailed(true)}
        />
      )}
      {!compact && (
        <span>
          <b>B Developer</b>
          <small>Education Platform</small>
        </span>
      )}
    </div>
  )
}

function Button({
  children,
  icon: Icon,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode
  icon?: LucideIcon
  variant?: "primary" | "secondary" | "ghost" | "danger"
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  )
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  badge,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  badge?: boolean
}) {
  return (
    <button className="icon-button" onClick={onClick} aria-label={label}>
      <Icon size={20} />
      {badge && <i />}
    </button>
  )
}

function ThemeToggle({
  theme,
  onToggle,
  floating = false,
}: {
  theme: Theme
  onToggle: () => void
  floating?: boolean
}) {
  const Icon = theme === "dark" ? Sun : Moon
  const label = theme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"

  return (
    <button
      className={`theme-toggle ${floating ? "theme-toggle-floating" : ""}`}
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <Icon size={18} />
    </button>
  )
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "blue" | "green" | "orange" | "red"
}) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  )
}

function Select({
  children,
  defaultValue,
  value,
  required = false,
  onChange,
}: {
  children: ReactNode
  defaultValue?: string
  value?: string
  required?: boolean
  onChange?: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <span className="select-wrap">
      <select
        defaultValue={defaultValue}
        value={value}
        required={required}
        aria-expanded={isOpen}
        onMouseDown={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", " ", "Enter"].includes(event.key)) {
            setIsOpen(true)
          }
          if (event.key === "Escape") setIsOpen(false)
        }}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          setIsOpen(false)
          onChange?.(event.target.value)
        }}
      >
        {children}
      </select>
      <ChevronDown className={isOpen ? "open" : ""} size={16} />
    </span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  change: string
  tone: "blue" | "green" | "orange" | "navy"
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className={`stat-icon ${tone}`}>
          <Icon size={21} />
        </span>
        <Badge tone={change.includes("+") ? "green" : "neutral"}>
          {change.includes("+") && <TrendingUp size={13} />} {change}
        </Badge>
      </div>
      <span>{label}</span>
      <strong className="latin">{value}</strong>
    </article>
  )
}

function Progress({ value, tone = "blue" }: { value: number; tone?: string }) {
  return (
    <span className={`progress ${tone}`}>
      <i style={{ width: `${value}%` }} />
    </span>
  )
}

function RevenueChart() {
  return (
    <div className="revenue-chart">
      <div className="chart-y">
        <span>60K</span>
        <span>40K</span>
        <span>20K</span>
        <span>0</span>
      </div>
      <div className="chart-canvas">
        <i />
        <i />
        <i />
        <i />
        <svg
          viewBox="0 0 720 220"
          preserveAspectRatio="none"
          aria-label="منحنى الإيرادات"
        >
          <defs>
            <linearGradient id="brandArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity=".26" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="chart-area"
            d="M0 188 C55 176 68 135 126 150 C185 168 210 99 268 111 C325 124 346 74 408 86 C470 100 484 45 548 65 C610 85 640 28 720 36 L720 220 L0 220Z"
          />
          <path
            className="chart-line"
            d="M0 188 C55 176 68 135 126 150 C185 168 210 99 268 111 C325 124 346 74 408 86 C470 100 484 45 548 65 C610 85 640 28 720 36"
          />
          <circle cx="548" cy="65" r="6" />
          <circle cx="720" cy="36" r="6" />
        </svg>
        <div className="chart-days">
          {["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map(
            (day) => (
              <span key={day}>{day}</span>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ open }: { open: (modal: ModalType) => void }) {
  return (
    <>
      <PageHeader
        title="صباح الخير، أحمد"
        description="إليك ملخص أداء منصتك التعليمية اليوم."
        actions={
          <>
            <Button
              variant="secondary"
              icon={Download}
              onClick={() => open("export")}
            >
              تصدير التقرير
            </Button>
            <Button icon={Plus} onClick={() => open("course")}>
              إنشاء دورة جديدة
            </Button>
          </>
        }
      />
      <section className="stats-grid">
        <StatCard
          icon={Users}
          label="إجمالي الطلاب"
          value="384"
          change="+12.5%"
          tone="blue"
        />
        <StatCard
          icon={UserCheck}
          label="نسبة الحضور"
          value="91.8%"
          change="+3.2%"
          tone="green"
        />
        <StatCard
          icon={CircleDollarSign}
          label="إجمالي الإيرادات"
          value="128,400 ج.م"
          change="+18.1%"
          tone="navy"
        />
        <StatCard
          icon={PenLine}
          label="بانتظار التصحيح"
          value="27"
          change="5 عاجلة"
          tone="orange"
        />
      </section>
      <section className="dashboard-main">
        <article className="card chart-card">
          <div className="card-header">
            <div>
              <h2>نمو الإيرادات</h2>
              <p>الإيرادات المحققة من جميع قنوات الدفع</p>
            </div>
            <Select defaultValue="week">
              <option value="week">آخر 7 أيام</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">آخر 3 أشهر</option>
            </Select>
          </div>
          <div className="chart-summary">
            <strong className="latin">42,840 ج.م</strong>
            <Badge tone="green">
              <TrendingUp size={13} /> 14.2%
            </Badge>
          </div>
          <RevenueChart />
        </article>
        <article className="card attendance-card">
          <div className="card-header">
            <div>
              <h2>الحضور اليوم</h2>
              <p>آخر عمليات تسجيل الدخول</p>
            </div>
            <Badge tone="green">
              <i className="live-dot" /> مباشر
            </Badge>
          </div>
          <div className="attendance-score">
            <span>
              <strong className="latin">94%</strong>
              <small>نسبة الحضور</small>
            </span>
            <div>
              <b className="latin">362</b>
              <small>حاضر من 384</small>
            </div>
          </div>
          {[
            ["عمر أحمد", "مجموعة السبت", "منذ دقيقة"],
            ["سارة محمد", "مجموعة الأحد", "منذ 3 دقائق"],
            ["يوسف علي", "مجموعة السبت", "منذ 5 دقائق"],
          ].map(([name, group, time], index) => (
            <div className="activity-row" key={name}>
              <span className={`avatar color-${index}`}>
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="grow">
                <b>{name}</b>
                <small>{group}</small>
              </span>
              <span className="activity-time">
                <CheckCircle2 size={16} />
                {time}
              </span>
            </div>
          ))}
          <Button variant="ghost" onClick={() => open("manual-attendance")}>
            عرض سجل الحضور <ArrowLeft size={16} />
          </Button>
        </article>
      </section>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>الدورات الأكثر نشاطاً</h2>
            <p>معدلات التقدم والتفاعل خلال الأسبوع الحالي</p>
          </div>
          <Button variant="ghost" onClick={() => open("course")}>
            إدارة الدورات <ArrowLeft size={16} />
          </Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>الدورة</th>
                <th>الطلاب</th>
                <th>التقدم</th>
                <th>الحضور</th>
                <th>الحالة</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[
                ["فيزياء الصف الثالث الثانوي", 384, 78, "94%", "نشطة"],
                ["أساسيات الميكانيكا", 216, 64, "88%", "نشطة"],
                [
                  "المراجعة النهائية — الكهرباء",
                  152,
                  42,
                  "82%",
                  "التسجيل مفتوح",
                ],
              ].map(([name, students, progress, attendance, status], index) => (
                <tr key={String(name)}>
                  <td>
                    <span className={`course-icon c${index}`}>
                      <BookOpen size={19} />
                    </span>
                    <b>{name}</b>
                  </td>
                  <td className="latin">{format.format(Number(students))}</td>
                  <td>
                    <div className="progress-cell">
                      <Progress value={Number(progress)} />
                      <small className="latin">{progress}%</small>
                    </div>
                  </td>
                  <td className="latin">{attendance}</td>
                  <td>
                    <Badge tone={index === 2 ? "blue" : "green"}>
                      {status}
                    </Badge>
                  </td>
                  <td>
                    <IconButton
                      icon={MoreHorizontal}
                      label="خيارات الدورة"
                      onClick={() => open("course")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Curriculum({ open }: { open: (modal: ModalType) => void }) {
  const [unit, setUnit] = useState(1)
  return (
    <>
      <PageHeader
        title="بناء المناهج والدروس"
        description="نظّم وحدات ودروس دوراتك من مكان واحد."
        actions={
          <>
            <span className="saved-state">
              <Check size={15} /> تم حفظ التغييرات
            </span>
            <Button
              variant="secondary"
              icon={Play}
              onClick={() => open("course")}
            >
              معاينة الدورة
            </Button>
            <Button icon={Plus} onClick={() => open("lesson")}>
              إضافة محتوى
            </Button>
          </>
        }
      />
      <div className="builder">
        <aside className="card units">
          <div className="card-header">
            <div>
              <h2>هيكل الدورة</h2>
              <p>4 وحدات · 17 درساً</p>
            </div>
            <IconButton
              icon={Plus}
              label="إضافة وحدة"
              onClick={() => open("lesson")}
            />
          </div>
          {[
            "مدخل إلى الفيزياء",
            "الحركة في خط مستقيم",
            "قوانين نيوتن",
            "الشغل والطاقة",
          ].map((name, index) => (
            <button
              className={`unit ${unit === index ? "active" : ""}`}
              onClick={() => setUnit(index)}
              key={name}
            >
              <span className="unit-number latin">0{index + 1}</span>
              <span className="grow">
                <b>{name}</b>
                <small>{index + 2} دروس</small>
              </span>
              <ChevronLeft size={17} />
            </button>
          ))}
          <Button variant="ghost" icon={Plus} onClick={() => open("lesson")}>
            إضافة وحدة جديدة
          </Button>
        </aside>
        <section className="card lessons">
          <div className="card-header">
            <div>
              <span className="section-kicker">الوحدة {unit + 1}</span>
              <h2>
                {
                  [
                    "مدخل إلى الفيزياء",
                    "الحركة في خط مستقيم",
                    "قوانين نيوتن",
                    "الشغل والطاقة",
                  ][unit]
                }
              </h2>
            </div>
            <Button
              variant="secondary"
              icon={Upload}
              onClick={() => open("lesson")}
            >
              رفع ملفات
            </Button>
          </div>
          {[
            [Video, "مفهوم الإزاحة والمسافة", "فيديو · 12:40", "blue"],
            [FileText, "ملخص قوانين الحركة", "ملف PDF · 2.4 MB", "red"],
            [PenLine, "اختبار قصير على السرعة", "اختبار · 10 أسئلة", "orange"],
            [Video, "العجلة والتسارع", "فيديو · 18:20", "green"],
          ].map(([ItemIcon, title, meta, tone], index) => {
            const LessonIcon = ItemIcon as LucideIcon
            return (
              <div className="lesson" key={String(title)}>
                <GripVertical size={18} />
                <span className={`lesson-icon ${tone}`}>
                  <LessonIcon size={19} />
                </span>
                <span className="grow">
                  <b>{String(title)}</b>
                  <small>{String(meta)}</small>
                </span>
                {index === 2 && <Badge tone="orange">يتطلب الدرس السابق</Badge>}
                <IconButton
                  icon={MoreHorizontal}
                  label="تعديل الدرس"
                  onClick={() => open("lesson")}
                />
              </div>
            )
          })}
          <button className="upload-zone" onClick={() => open("lesson")}>
            <span>
              <Upload size={24} />
            </span>
            <b>اسحب الملفات هنا أو اضغط للرفع</b>
            <small>PDF، MP4، صور · الحد الأقصى 250 MB</small>
          </button>
        </section>
        <aside className="card settings-card">
          <h2>إعدادات النشر</h2>
          <Toggle label="متاح للطلاب" defaultOn />
          <Toggle label="ترتيب إجباري للدروس" defaultOn />
          <Toggle label="السماح بتحميل الملفات" />
          <hr />
          <label className="field">
            <span>تاريخ الإتاحة</span>
            <input type="datetime-local" />
          </label>
          <label className="field">
            <span>حالة الدورة</span>
            <Select defaultValue="published">
              <option value="published">منشورة</option>
              <option value="draft">مسودة</option>
            </Select>
          </label>
          <Button onClick={() => open("course")}>حفظ إعدادات النشر</Button>
        </aside>
      </div>
    </>
  )
}

function Toggle({
  label,
  defaultOn = false,
}: {
  label: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button className="toggle-row" onClick={() => setOn(!on)} aria-pressed={on}>
      <span>{label}</span>
      <i className={`toggle ${on ? "on" : ""}`}>
        <i />
      </i>
    </button>
  )
}

function Groups({ open }: { open: (modal: ModalType) => void }) {
  const [query, setQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const students = [
    [
      "عمر أحمد إبراهيم",
      "010 2345 6789",
      "مجموعة السبت",
      "سنتر القاهرة",
      "نشط",
      "92%",
    ],
    [
      "سارة محمد علي",
      "010 7854 3210",
      "مجموعة الأحد",
      "سنتر القاهرة",
      "نشط",
      "88%",
    ],
    [
      "يوسف علي حسن",
      "011 4582 9631",
      "مجموعة السبت",
      "فرع مدينة نصر",
      "موقوف",
      "74%",
    ],
    [
      "نور محمود أحمد",
      "012 3698 7412",
      "مجموعة الثلاثاء",
      "سنتر القاهرة",
      "نشط",
      "96%",
    ],
    [
      "كريم أحمد عمر",
      "010 1478 5236",
      "مجموعة الأحد",
      "فرع مدينة نصر",
      "نشط",
      "81%",
    ],
  ]
  const visibleStudents = students.filter(
    ([name, phone, group]) =>
      (name.includes(query) || phone.includes(query)) &&
      (groupFilter === "all" || group === groupFilter),
  )
  return (
    <>
      <PageHeader
        title="إدارة المجموعات والسناتر"
        description="تابع الجداول، السعة، والحجوزات لكل مجموعة."
        actions={
          <>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => open("group")}
            >
              إضافة مجموعة
            </Button>
            <Button icon={UserPlus} onClick={() => open("add-student")}>
              إضافة طالب
            </Button>
          </>
        }
      />
      <section className="group-stats">
        {[
          ["مجموعة السبت", 28, 30, "اقتربت من الاكتمال", "orange"],
          ["مجموعة الأحد", 19, 30, "متاحة للحجز", "green"],
          ["مجموعة الثلاثاء", 30, 30, "مكتملة", "red"],
        ].map(([name, current, total, status, tone]) => (
          <article className="card capacity-card" key={String(name)}>
            <div>
              <span>
                <b>{name}</b>
                <small>Education Platform · القاهرة</small>
              </span>
              <Badge tone={tone as "orange"}>{status}</Badge>
            </div>
            <strong className="latin">
              {current}
              <small> / {total} طالب</small>
            </strong>
            <Progress
              value={(Number(current) / Number(total)) * 100}
              tone={String(tone)}
            />
            <button onClick={() => open("group")}>
              إدارة المجموعة <ChevronLeft size={16} />
            </button>
          </article>
        ))}
      </section>
      <article className="card student-directory">
        <div className="card-header">
          <div>
            <h2>دليل الطلاب</h2>
            <p>{students.length} طلاب مسجلين في مجموعاتك</p>
          </div>
          <div className="directory-filters">
            <label className="search-field">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث بالاسم أو الهاتف..."
              />
            </label>
            <Select value={groupFilter} onChange={setGroupFilter}>
              <option value="all">كل المجموعات</option>
              <option>مجموعة السبت</option>
              <option>مجموعة الأحد</option>
              <option>مجموعة الثلاثاء</option>
            </Select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>الطالب</th>
                <th>رقم الهاتف</th>
                <th>المجموعة</th>
                <th>السنتر</th>
                <th>التقدم</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map(
                ([name, phone, group, center, status, progress], index) => (
                  <tr key={name}>
                    <td>
                      <span className={`avatar color-${index % 4}`}>
                        {name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <b>{name}</b>
                    </td>
                    <td className="latin">{phone}</td>
                    <td>{group}</td>
                    <td>{center}</td>
                    <td>
                      <div className="progress-cell">
                        <Progress value={Number(progress.replace("%", ""))} />
                        <small>{progress}</small>
                      </div>
                    </td>
                    <td>
                      <Badge tone={status === "نشط" ? "green" : "red"}>
                        {status}
                      </Badge>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedStudent(name)}
                        >
                          عرض الملف
                        </Button>
                        <IconButton
                          icon={MoreHorizontal}
                          label="إدارة الطالب"
                          onClick={() => setSelectedStudent(name)}
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        {visibleStudents.length === 0 && (
          <div className="directory-empty">
            <Search size={25} />
            <b>لا توجد نتائج مطابقة</b>
            <span>جرّب تغيير البحث أو المجموعة.</span>
          </div>
        )}
      </article>
      <article className="card schedule-card">
        <div className="card-header">
          <div>
            <h2>الجدول الأسبوعي</h2>
            <p>24 - 30 يونيو 2025</p>
          </div>
          <div className="schedule-actions">
            <Button variant="secondary" onClick={() => open("export")}>
              طباعة الجدول
            </Button>
            <IconButton
              icon={ChevronLeft}
              label="الأسبوع السابق"
              onClick={() => open("group")}
            />
          </div>
        </div>
        <div className="schedule">
          <div className="time-column">
            {["3:00 م", "4:00 م", "5:00 م", "6:00 م", "7:00 م"].map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>
          {["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map(
            (day, index) => (
              <div className="day" key={day}>
                <b>{day}</b>
                {index !== 2 && (
                  <button
                    className={`class-event event-${index}`}
                    onClick={() => open("group")}
                  >
                    <span>فيزياء 3 ثانوي</span>
                    <strong>{index % 2 ? "مجموعة ب" : "مجموعة أ"}</strong>
                    <small>
                      <Clock3 size={13} /> 5:00 - 6:30
                    </small>
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      </article>
      {selectedStudent && (
        <aside className="student-drawer">
          <div
            className="drawer-backdrop"
            onClick={() => setSelectedStudent(null)}
          />
          <section>
            <header>
              <div>
                <h2>ملف الطالب</h2>
                <p>البيانات والمجموعة والحالة الأكاديمية</p>
              </div>
              <IconButton
                icon={X}
                label="إغلاق"
                onClick={() => setSelectedStudent(null)}
              />
            </header>
            <div className="drawer-student">
              <span className="avatar">عخ</span>
              <h2>{selectedStudent}</h2>
              <p>الصف الثالث الثانوي</p>
              <Badge tone="green">حساب نشط</Badge>
            </div>
            <div className="drawer-stats">
              <span>
                <b className="latin">92%</b>
                <small>متوسط الدرجات</small>
              </span>
              <span>
                <b className="latin">94%</b>
                <small>نسبة الحضور</small>
              </span>
            </div>
            <label className="field">
              <span>المجموعة الحالية</span>
              <Select>
                <option>مجموعة السبت</option>
                <option>مجموعة الأحد</option>
                <option>مجموعة الثلاثاء</option>
              </Select>
            </label>
            <label className="field">
              <span>السنتر</span>
              <Select>
                <option>سنتر القاهرة</option>
                <option>فرع مدينة نصر</option>
              </Select>
            </label>
            <div className="drawer-contact">
              <span>
                <b>رقم الطالب</b>
                <small className="latin">010 2345 6789</small>
              </span>
              <span>
                <b>رقم ولي الأمر</b>
                <small className="latin">011 5578 9024</small>
              </span>
            </div>
            <Button onClick={() => setSelectedStudent(null)}>
              حفظ التغييرات
            </Button>
            <Button variant="danger" onClick={() => setSelectedStudent(null)}>
              إزالة الطالب من المجموعة
            </Button>
          </section>
        </aside>
      )}
    </>
  )
}

function Attendance({ open }: { open: (modal: ModalType) => void }) {
  const [cameraOn, setCameraOn] = useState(true)
  return (
    <>
      <PageHeader
        title="تسجيل الحضور المباشر"
        description="امسح رمز الطالب أو سجّل الحضور يدوياً."
        actions={
          <Button
            variant="secondary"
            icon={UserCheck}
            onClick={() => open("manual-attendance")}
          >
            تسجيل يدوي
          </Button>
        }
      />
      <div className="attendance-layout">
        <section className="scanner">
          <div className="scanner-top">
            <Badge tone={cameraOn ? "green" : "red"}>
              <i className="live-dot" />
              {cameraOn ? "الكاميرا تعمل" : "الكاميرا متوقفة"}
            </Badge>
            <Select defaultValue="main">
              <option value="main">كاميرا البوابة الرئيسية</option>
              <option value="external">كاميرا خارجية</option>
            </Select>
          </div>
          <div className={`camera-box ${!cameraOn ? "off" : ""}`}>
            {cameraOn ? (
              <>
                <div className="scan-corners">
                  <i />
                  <i />
                  <i />
                  <i />
                  <span />
                </div>
                <p>
                  <QrCode size={19} /> ضع رمز الطالب داخل الإطار
                </p>
              </>
            ) : (
              <>
                <Camera size={54} />
                <b>الكاميرا متوقفة</b>
              </>
            )}
          </div>
          <div className="scanner-controls">
            <Button
              variant="secondary"
              icon={Camera}
              onClick={() => setCameraOn(!cameraOn)}
            >
              {cameraOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
            </Button>
            <Button icon={QrCode} onClick={() => open("manual-attendance")}>
              اختبار قارئ QR
            </Button>
          </div>
        </section>
        <aside className="card live-results">
          <div className="card-header">
            <div>
              <h2>الحضور اللحظي</h2>
              <p>تم تسجيل 178 طالباً اليوم</p>
            </div>
            <Badge tone="blue">تحديث مباشر</Badge>
          </div>
          {[
            ["سارة محمد علي", "مجموعة السبت", "5:57 م"],
            ["أحمد خالد حسن", "مجموعة الأحد", "5:54 م"],
            ["نور علي محمود", "مجموعة السبت", "5:51 م"],
            ["كريم محمد عمر", "مجموعة الثلاثاء", "5:48 م"],
          ].map(([name, group, time], index) => (
            <div className="checkin" key={name}>
              <span className={`avatar color-${index}`}>
                {name
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0])
                  .join("")}
              </span>
              <span className="grow">
                <b>{name}</b>
                <small>{group}</small>
              </span>
              <span>
                <CheckCircle2 size={17} />
                <small>{time}</small>
              </span>
            </div>
          ))}
          <Button variant="secondary" onClick={() => open("export")}>
            تحميل سجل اليوم
          </Button>
        </aside>
      </div>
    </>
  )
}

function Questions({ open }: { open: (modal: ModalType) => void }) {
  const [tab, setTab] = useState("questions")
  const [page, setPage] = useState(1)
  return (
    <>
      <PageHeader
        title="بنك الأسئلة والامتحانات"
        description="أنشئ أسئلة احترافية وابنِ امتحاناتك بسهولة."
        actions={
          <>
            <Button
              variant="secondary"
              icon={FileText}
              onClick={() => open("export")}
            >
              استيراد أسئلة
            </Button>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => open("question")}
            >
              سؤال جديد
            </Button>
            <Button icon={PenLine} onClick={() => open("exam")}>
              إنشاء امتحان
            </Button>
          </>
        }
      />
      <div className="tabs">
        <button
          className={tab === "questions" ? "active" : ""}
          onClick={() => setTab("questions")}
        >
          بنك الأسئلة <span>248</span>
        </button>
        <button
          className={tab === "exams" ? "active" : ""}
          onClick={() => setTab("exams")}
        >
          الامتحانات <span>16</span>
        </button>
        <button
          className={tab === "drafts" ? "active" : ""}
          onClick={() => setTab("drafts")}
        >
          المسودات <span>7</span>
        </button>
      </div>
      <article className="card questions-card">
        <div className="filters">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث في بنك الأسئلة..." />
          </label>
          <Select defaultValue="all">
            <option value="all">كل الوحدات</option>
            <option>قوانين نيوتن</option>
            <option>الحركة</option>
          </Select>
          <Select defaultValue="all">
            <option value="all">كل الأنواع</option>
            <option>اختيار من متعدد</option>
            <option>مقالي</option>
          </Select>
        </div>
        {[
          [
            "إذا أثرت قوة مقدارها 20N على جسم كتلته 4kg، فما مقدار العجلة؟",
            "اختيار من متعدد",
            "قوانين نيوتن",
            "متوسط",
          ],
          [
            "اشرح العلاقة بين السرعة المتجهة والعجلة مع ذكر مثال.",
            "سؤال مقالي",
            "الحركة",
            "متقدم",
          ],
          [
            "أي من الكميات التالية تعتبر كمية متجهة؟",
            "اختيار من متعدد",
            "القياس",
            "سهل",
          ],
          [
            "استنتج قانون الشغل المبذول بواسطة قوة ثابتة.",
            "سؤال مقالي",
            "الشغل والطاقة",
            "متقدم",
          ],
        ].map(([question, type, unit, level], index) => (
          <div className="question-row" key={question}>
            <span className="question-number latin">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="grow">
              <b>{question}</b>
              <small>
                <Badge tone="blue">{type}</Badge>
                <span>{unit}</span>
                <span>درجة واحدة</span>
              </small>
            </span>
            <Badge
              tone={
                level === "سهل" ? "green" : level === "متوسط" ? "orange" : "red"
              }
            >
              {level}
            </Badge>
            <IconButton
              icon={MoreHorizontal}
              label="خيارات السؤال"
              onClick={() => open("question")}
            />
          </div>
        ))}
        <div className="pagination">
          <span>
            عرض {(page - 1) * 4 + 1} - {page * 4} من 248
          </span>
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((item) => (
              <button
                className={page === item ? "active" : ""}
                onClick={() => setPage(item)}
                key={item}
              >
                {item}
              </button>
            ))}
            <button onClick={() => setPage(page + 1)}>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </article>
    </>
  )
}

function Reports({ open }: { open: (modal: ModalType) => void }) {
  return (
    <>
      <PageHeader
        title="التقارير والمالية"
        description="تابع الأداء المالي والأكاديمي واتخذ قرارات أفضل."
        actions={
          <>
            <Button
              variant="secondary"
              icon={Download}
              onClick={() => open("export")}
            >
              تصدير البيانات
            </Button>
            <Button icon={WalletCards} onClick={() => open("withdraw")}>
              طلب سحب
            </Button>
          </>
        }
      />
      <section className="stats-grid">
        <StatCard
          icon={CircleDollarSign}
          label="مبيعات الأونلاين"
          value="128,400 ج.م"
          change="+18.1%"
          tone="blue"
        />
        <StatCard
          icon={ReceiptText}
          label="إيصالات السنتر"
          value="64,250 ج.م"
          change="+7.4%"
          tone="green"
        />
        <StatCard
          icon={WalletCards}
          label="الرصيد المتاح"
          value="163,925 ج.م"
          change="متاح للسحب"
          tone="navy"
        />
        <StatCard
          icon={Activity}
          label="متوسط نجاح الطلاب"
          value="82.4%"
          change="+4.2%"
          tone="orange"
        />
      </section>
      <div className="reports-grid">
        <article className="card chart-card">
          <div className="card-header">
            <div>
              <h2>الأداء المالي</h2>
              <p>مقارنة الإيرادات والمصروفات</p>
            </div>
            <Select defaultValue="month">
              <option value="month">هذا الشهر</option>
              <option>الشهر الماضي</option>
            </Select>
          </div>
          <RevenueChart />
        </article>
        <article className="card settlement">
          <div className="card-header">
            <div>
              <h2>التسوية القادمة</h2>
              <p>30 يونيو 2025</p>
            </div>
            <span className="settlement-icon">
              <WalletCards size={22} />
            </span>
          </div>
          <strong className="latin">163,925 ج.م</strong>
          <p>سيتم التحويل إلى حسابك البنكي المنتهي بـ 4821.</p>
          <Progress value={72} />
          <small>متبقي 6 أيام على التسوية</small>
          <Button onClick={() => open("withdraw")}>طلب سحب مبكر</Button>
        </article>
      </div>
      <article className="card">
        <div className="card-header">
          <div>
            <h2>أحدث المعاملات</h2>
            <p>آخر عمليات الدفع والتسوية</p>
          </div>
          <Button variant="ghost" onClick={() => open("export")}>
            عرض كل المعاملات <ArrowLeft size={16} />
          </Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>العملية</th>
                <th>الطالب</th>
                <th>التاريخ</th>
                <th>طريقة الدفع</th>
                <th>المبلغ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "اشتراك في دورة الفيزياء",
                  "عمر أحمد",
                  "24 يونيو، 11:42 ص",
                  "بطاقة بنكية",
                  "450 ج.م",
                ],
                [
                  "حصة مراجعة نهائية",
                  "سارة محمد",
                  "24 يونيو، 10:18 ص",
                  "فوري",
                  "150 ج.م",
                ],
                [
                  "اشتراك شهري",
                  "يوسف علي",
                  "23 يونيو، 8:36 م",
                  "محفظة",
                  "450 ج.م",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>
                    <b>{row[0]}</b>
                  </td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td className="latin">
                    <b>{row[4]}</b>
                  </td>
                  <td>
                    <Badge tone="green">مكتملة</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  )
}

function LandingPage({
  login,
  signup,
  open,
  theme,
  toggleTheme,
}: {
  login: () => void
  signup: () => void
  open: (modal: ModalType) => void
  theme: Theme
  toggleTheme: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="public-page" dir="rtl">
      <nav className="public-nav">
        <Brand />
        <div className={`public-links ${mobileMenuOpen ? "open" : ""}`}>
          <button
            onClick={() => {
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
              setMobileMenuOpen(false)
            }}
          >
            المميزات
          </button>
          <button
            onClick={() => {
              document
                .getElementById("courses")
                ?.scrollIntoView({ behavior: "smooth" })
              setMobileMenuOpen(false)
            }}
          >
            الدورات
          </button>
          <button
            onClick={() => {
              document
                .getElementById("stats")
                ?.scrollIntoView({ behavior: "smooth" })
              setMobileMenuOpen(false)
            }}
          >
            عن المنصة
          </button>
        </div>
        <div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Button variant="ghost" onClick={login}>
            تسجيل الدخول
          </Button>
          <Button onClick={signup}>إنشاء حساب</Button>
          <button
            className="public-mobile-menu"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      <main>
        <section className="public-hero">
          <div className="hero-copy">
            <Badge tone="blue">
              <Star size={14} /> منصة تعليمية عربية متكاملة
            </Badge>
            <h1>
              تجربة تعليمية أذكى.
              <br />
              <span>نتائج أقوى.</span>
            </h1>
            <p>
              منصة هجينة تجمع إدارة السناتر، التعلم الإلكتروني، الاختبارات
              والمتابعة الأسرية في مكان واحد.
            </p>
            <div className="hero-actions">
              <Button onClick={signup}>
                ابدأ رحلتك التعليمية <ArrowLeft size={17} />
              </Button>
              <Button
                variant="secondary"
                icon={Play}
                onClick={() => open("course-details")}
              >
                شاهد كلمة المدرّس
              </Button>
            </div>
            <div className="trusted-row">
              <span className="avatar">أم</span>
              <span className="avatar color-1">عخ</span>
              <span className="avatar color-2">سم</span>
              <p>
                <b>+384</b> طالب يتعلمون مع أ. أحمد محمود
              </p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-dashboard">
              <div className="mock-head">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <b>Education Platform</b>
              </div>
              <div className="mock-layout">
                <aside>
                  <i />
                  <i />
                  <i />
                  <i />
                </aside>
                <div>
                  <div className="mock-kpis">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mock-chart">
                    <RevenueChart />
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-result">
              <span>
                <Award size={21} />
              </span>
              <div>
                <b>نتيجة ممتازة</b>
                <small>حقق طلابك معدل نجاح 92%</small>
              </div>
            </div>
            <div className="floating-live">
              <i className="live-dot" />
              <b>حصة مباشرة الآن</b>
              <span className="latin">84</span> طالب
            </div>
          </div>
        </section>
        <section className="public-stats" id="stats">
          {[
            ["384+", "طالب التحق بالمنصة"],
            ["8+", "سنوات خبرة"],
            ["1.8K", "درس مكتمل"],
            ["92%", "معدل النجاح"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong className="latin">{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>
        <section className="feature-section" id="features">
          <span className="section-kicker">كل ما تحتاجه في منصة واحدة</span>
          <h2>كل أدوات أ. أحمد محمود في مكان واحد</h2>
          <p>
            شرح مباشر، محتوى مسجل، اختبارات ومتابعة مستمرة للطالب وولي الأمر.
          </p>
          <div className="feature-grid">
            {[
              [
                LayoutDashboard,
                "إدارة ذكية",
                "لوحات تحكم وتقارير لحظية تساعدك في اتخاذ القرار.",
              ],
              [
                MonitorPlay,
                "تعلم تفاعلي",
                "فيديوهات آمنة، اختبارات، ومتابعة دقيقة لتقدم الطالب.",
              ],
              [
                QrCode,
                "حضور سريع",
                "تسجيل الحضور عبر QR وإشعارات فورية لولي الأمر.",
              ],
              [
                ShieldCheck,
                "حماية متقدمة",
                "صلاحيات دقيقة وحماية كاملة للمحتوى والبيانات.",
              ],
            ].map(([FeatureIcon, title, text]) => {
              const Icon = FeatureIcon as LucideIcon
              return (
                <article key={String(title)}>
                  <span>
                    <Icon size={23} />
                  </span>
                  <h3>{String(title)}</h3>
                  <p>{String(text)}</p>
                </article>
              )
            })}
          </div>
        </section>
        <section className="course-showcase" id="courses">
          <div className="section-heading">
            <div>
              <span className="section-kicker">دورات أ. أحمد محمود</span>
              <h2>اختر المسار المناسب لك</h2>
            </div>
            <Button variant="secondary" onClick={signup}>
              استكشف كل الدورات
            </Button>
          </div>
          <div className="public-courses">
            {[
              [
                "فيزياء الصف الثالث الثانوي",
                "أ. أحمد محمود",
                "32 درساً",
                "450 ج.م",
                "physics",
              ],
              [
                "المراجعة النهائية في الفيزياء",
                "أ. أحمد محمود",
                "28 درساً",
                "380 ج.م",
                "math",
              ],
              [
                "أساسيات الميكانيكا الحديثة",
                "أ. أحمد محمود",
                "24 درساً",
                "420 ج.م",
                "chemistry",
              ],
            ].map(([title, teacher, lessons, price, tone]) => (
              <article className="public-course" key={title}>
                <div className={`course-art ${tone}`}>
                  <BookOpen size={40} />
                  <button onClick={() => open("course-details")}>
                    <Play size={19} fill="currentColor" />
                  </button>
                </div>
                <div>
                  <Badge tone="blue">الأكثر طلباً</Badge>
                  <h3>{title}</h3>
                  <p>{teacher}</p>
                  <span>
                    <small>{lessons}</small>
                    <strong className="latin">{price}</strong>
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => open("course-details")}
                  >
                    عرض التفاصيل
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="testimonials-section">
          <span className="section-kicker">قصص نجاح طلابنا</span>
          <h2>ثقة بُنيت على نتائج حقيقية</h2>
          <div>
            {[
              [
                "شرح أ. أحمد منظم جداً، وقدرت أرفع درجتي من 68% إلى 91% في شهرين.",
                "عمر أحمد",
                "طالب بالصف الثالث الثانوي",
              ],
              [
                "أتابع حضور ابني ونتائجه أولاً بأول، والمنصة جعلت التواصل أسهل كثيراً.",
                "أحمد خالد",
                "ولي أمر",
              ],
              [
                "الاختبارات بعد كل وحدة ساعدتني أعرف نقاط ضعفي وأراجعها قبل الامتحان.",
                "سارة محمد",
                "طالبة بالصف الثالث الثانوي",
              ],
            ].map(([quote, name, role]) => (
              <article className="testimonial-card" key={name}>
                <span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star size={14} fill="currentColor" key={star} />
                  ))}
                </span>
                <p>«{quote}»</p>
                <div>
                  <i className="avatar">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </i>
                  <b>
                    {name}
                    <small>{role}</small>
                  </b>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="public-cta">
          <div>
            <h2>جاهز تبدأ رحلتك مع أ. أحمد محمود؟</h2>
            <p>انضم إلى آلاف الطلاب الذين يحققون نتائج أفضل كل يوم.</p>
          </div>
          <Button onClick={signup}>
            أنشئ حسابك الآن <ArrowLeft size={17} />
          </Button>
        </section>
      </main>
      <footer className="public-footer">
        <Brand />
        <p>© 2025 Education Platform. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}

const demoAccounts: {
  email: string
  password: string
  role: Extract<Portal, "student" | "parent" | "instructor">
  name: string
}[] = [
  {
    email: "student@demo.com",
    password: "Student@123",
    role: "student",
    name: "عمر أحمد",
  },
  {
    email: "parent@demo.com",
    password: "Parent@123",
    role: "parent",
    name: "أحمد خالد",
  },
  {
    email: "teacher@demo.com",
    password: "Teacher@123",
    role: "instructor",
    name: "أ. أحمد محمود",
  },
]

function AuthPage({
  enter,
  back,
  signup,
  theme,
  toggleTheme,
}: {
  enter: (portal: Portal, name?: string) => void
  back: () => void
  signup: () => void
  theme: Theme
  toggleTheme: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const account = demoAccounts.find(
      (demoAccount) =>
        demoAccount.email === email.trim() &&
        demoAccount.password === password,
    )
    if (!account) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.")
      return
    }
    enter(account.role, account.name)
  }
  return (
    <div className="auth-page" dir="rtl">
      <ThemeToggle theme={theme} onToggle={toggleTheme} floating />
      <button className="auth-back" onClick={back}>
        <ArrowLeft size={18} /> العودة للرئيسية
      </button>
      <section className="auth-brand-panel">
        <Brand />
        <div>
          <Badge tone="blue">Education Platform</Badge>
          <h1>كل رحلة نجاح تبدأ بخطوة.</h1>
          <p>سجّل دخولك واستكمل رحلتك التعليمية من حيث توقفت.</p>
        </div>
        <span>
          <ShieldCheck size={19} /> بياناتك محمية بتشفير متقدم
        </span>
      </section>
      <section className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div className="auth-logo">
            <Brand />
          </div>
          <h2>مرحباً بعودتك</h2>
          <p>اختر نوع حسابك ثم أدخل بيانات الدخول.</p>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <label className="auth-field">
            <span>البريد الإلكتروني أو رقم الهاتف</span>
            <i>
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </i>
          </label>
          <label className="auth-field">
            <span>كلمة المرور</span>
            <i>
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </i>
          </label>
          <div className="auth-meta">
            <label>
              <input type="checkbox" defaultChecked /> تذكّرني
            </label>
            <button type="button">نسيت كلمة المرور؟</button>
          </div>
          <Button type="submit">
            تسجيل الدخول <ArrowLeft size={17} />
          </Button>
          <small>
            ليس لديك حساب؟{" "}
            <button type="button" onClick={signup}>
              أنشئ حساباً جديداً
            </button>
          </small>
        </form>
      </section>
    </div>
  )
}

function SignupPage({
  enter,
  login,
  back,
  theme,
  toggleTheme,
}: {
  enter: (portal: Portal, name?: string) => void
  login: () => void
  back: () => void
  theme: Theme
  toggleTheme: () => void
}) {
  const [role, setRole] = useState<"student" | "parent">("student")
  const [form, setForm] = useState({
    studentName: "",
    mobile: "",
    grade: "الصف الثالث الثانوي",
    parentMobile: "",
    relation: "",
    parentName: "",
    studentFullName: "",
    studentMobile: "",
    password: "",
    confirmPassword: "",
    consent: false,
  })
  const [error, setError] = useState("")
  const updateForm = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const name = role === "student" ? form.studentName : form.parentName
    const phones = [form.mobile]
    if (role === "student") {
      phones.push(form.parentMobile)
    } else {
      phones.push(form.studentMobile)
    }

    if (
      !name.trim() ||
      (role === "parent" && !form.studentFullName.trim())
    ) {
      setError("يرجى إدخال الاسم بالكامل.")
      return
    }
    if (phones.some((phone) => !/^01[0125]\d{8}$/.test(phone))) {
      setError("يرجى إدخال رقم هاتف مصري صحيح.")
      return
    }
    if (form.password.length < 8) {
      setError("يجب ألا تقل كلمة المرور عن 8 أحرف.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.")
      return
    }
    if (role === "parent" && !form.relation) {
      setError("يرجى تحديد صلتك بالطالب.")
      return
    }
    if (!form.consent) {
      setError("يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.")
      return
    }
    setError("")
    enter(role, name.trim())
  }
  return (
    <div className="signup-page" dir="rtl">
      <ThemeToggle theme={theme} onToggle={toggleTheme} floating />
      <button className="signup-back" onClick={back}>
        <ArrowLeft size={18} /> العودة للرئيسية
      </button>
      <section className="signup-side">
        <Brand />
        <div>
          <Badge tone="blue">انضم إلى Education Platform</Badge>
          <h1>ابدأ رحلتك التعليمية مع أ. أحمد محمود.</h1>
          <p>دروس منظمة، اختبارات مستمرة، ومتابعة دقيقة للتقدم والحضور.</p>
        </div>
        <ul>
          <li>
            <CheckCircle2 size={18} />
            وصول فوري إلى الدورات المسجلة
          </li>
          <li>
            <CheckCircle2 size={18} />
            بطاقة حضور QR شخصية
          </li>
          <li>
            <CheckCircle2 size={18} />
            تقارير دورية للطالب وولي الأمر
          </li>
        </ul>
      </section>
      <section className="signup-form-wrap">
        <form className="signup-form" onSubmit={submit} noValidate>
          <div className="auth-logo">
            <Brand />
          </div>
          <h2>إنشاء حساب جديد</h2>
          <p>أدخل بياناتك الأساسية لإنشاء الحساب.</p>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <div className="role-tabs">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => {
                setRole("student")
                setError("")
              }}
            >
              <BookOpen size={18} />
              حساب طالب
            </button>
            <button
              type="button"
              className={role === "parent" ? "active" : ""}
              onClick={() => {
                setRole("parent")
                setError("")
              }}
            >
              <Users size={18} />
              حساب ولي أمر
            </button>
          </div>
          <div className="form-grid">
            {role === "student" ? (
              <>
                <label className="field full">
                  <span>الاسم بالكامل</span>
                  <input
                    value={form.studentName}
                    onChange={(event) =>
                      updateForm("studentName", event.target.value)
                    }
                    placeholder="اكتب الاسم الرباعي"
                  />
                </label>
                <label className="field">
                  <span>رقم الهاتف</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(event) =>
                      updateForm("mobile", event.target.value)
                    }
                    placeholder="01xxxxxxxxx"
                  />
                </label>
                <label className="field">
                  <span>الصف الدراسي</span>
                  <Select
                    value={form.grade}
                    onChange={(value) => updateForm("grade", value)}
                  >
                    <option>الصف الثالث الثانوي</option>
                    <option>الصف الثاني الثانوي</option>
                    <option>الصف الأول الثانوي</option>
                  </Select>
                </label>
                <label className="field full">
                  <span>رقم هاتف ولي الأمر</span>
                  <input
                    type="tel"
                    value={form.parentMobile}
                    onChange={(event) =>
                      updateForm("parentMobile", event.target.value)
                    }
                    placeholder="رقم لاستقبال التنبيهات والمتابعة"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="field full">
                  <span>الاسم بالكامل</span>
                  <input
                    value={form.parentName}
                    onChange={(event) =>
                      updateForm("parentName", event.target.value)
                    }
                    placeholder="اكتب الاسم الرباعي"
                  />
                </label>
                <label className="field">
                  <span>رقم الهاتف</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(event) =>
                      updateForm("mobile", event.target.value)
                    }
                    placeholder="01xxxxxxxxx"
                  />
                </label>
                <label className="field">
                  <span>صلة الطالب</span>
                  <Select
                    value={form.relation}
                    onChange={(value) => updateForm("relation", value)}
                  >
                    <option value="" disabled>
                      اختر صلتك بالطالب
                    </option>
                    <option>أب</option>
                    <option>أم</option>
                    <option>ولي أمر آخر</option>
                  </Select>
                </label>
                <label className="field full">
                  <span>اسم الطالب بالكامل</span>
                  <input
                    value={form.studentFullName}
                    onChange={(event) =>
                      updateForm("studentFullName", event.target.value)
                    }
                    placeholder="اكتب الاسم الرباعي"
                  />
                </label>
                <label className="field full">
                  <span>رقم هاتف الطالب</span>
                  <input
                    type="tel"
                    value={form.studentMobile}
                    onChange={(event) =>
                      updateForm("studentMobile", event.target.value)
                    }
                    placeholder="01xxxxxxxxx"
                  />
                </label>
              </>
            )}
            <label className="field">
              <span>كلمة المرور</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                placeholder="8 أحرف على الأقل"
              />
            </label>
            <label className="field">
              <span>تأكيد كلمة المرور</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  updateForm("confirmPassword", event.target.value)
                }
                placeholder="أعد كتابة كلمة المرور"
              />
            </label>
          </div>
          <label className="signup-consent">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => updateForm("consent", event.target.checked)}
            />{" "}
            أوافق على شروط الاستخدام وسياسة الخصوصية.
          </label>
          <Button type="submit" icon={UserPlus}>
            إنشاء الحساب
          </Button>
          <small>
            لديك حساب بالفعل؟{" "}
            <button type="button" onClick={login}>
              تسجيل الدخول
            </button>
          </small>
        </form>
      </section>
    </div>
  )
}

function StudentPortal({
  view,
  open,
  navigate,
}: {
  view: View
  open: (modal: ModalType) => void
  navigate: (view: View) => void
}) {
  const [completedAttempts, setCompletedAttempts] = useState<
    Record<string, StudentExamAttempt>
  >({})
  if (view === "student-courses") return <StudentCourses open={open} />
  if (view === "student-exam")
    return (
      <StudentExam
        completedAttempts={completedAttempts}
        saveAttempt={(examId, attempt) =>
          setCompletedAttempts((current) => ({
            ...current,
            [examId]: attempt,
          }))
        }
      />
    )
  if (view === "student-qr") return <StudentPass open={open} />
  return <StudentHome open={open} navigate={navigate} />
}

function StudentHome({
  open,
  navigate,
}: {
  open: (modal: ModalType) => void
  navigate: (view: View) => void
}) {
  return (
    <>
      <PageHeader
        title="مساء الخير، عمر"
        description="استكمل رحلتك وحقق هدفك اليوم."
        actions={
          <Button
            variant="secondary"
            icon={Wallet}
            onClick={() => open("recharge")}
          >
            الرصيد: 125 ج.م
          </Button>
        }
      />
      <section className="student-summary">
        <article className="student-welcome">
          <div>
            <Badge tone="blue">تقدم هذا الأسبوع</Badge>
            <h2>أنت على الطريق الصحيح!</h2>
            <p>أكملت 5 من 7 أهداف أسبوعية. استمر لتحافظ على سلسلة التعلّم.</p>
            <div className="weekly-progress">
              <span>
                <b>5/7</b>
                <small>أهداف مكتملة</small>
              </span>
              <Progress value={72} />
            </div>
          </div>
          <Award size={92} />
        </article>
        <article className="card next-class">
          <span className="class-date">
            <b className="latin">24</b>
            <small>يونيو</small>
          </span>
          <div className="grow">
            <Badge tone="red">
              <i className="live-dot" /> بعد 45 دقيقة
            </Badge>
            <h2>قوانين نيوتن للحركة</h2>
            <p>فيزياء الصف الثالث الثانوي · أ. أحمد محمود</p>
            <span>
              <Clock3 size={15} /> 6:00 - 7:30 مساءً
            </span>
          </div>
          <Button icon={Video} onClick={() => open("course-details")}>
            الانضمام للحصة
          </Button>
        </article>
      </section>
      <div className="section-heading">
        <div>
          <h2>دوراتي الحالية</h2>
          <p>تابع من النقطة التي توقفت عندها.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("student-courses")}>
          عرض الكل <ArrowLeft size={16} />
        </Button>
      </div>
      <section className="enrolled-grid">
        {[
          [
            "فيزياء الصف الثالث الثانوي",
            "الوحدة الثالثة: قوانين نيوتن",
            68,
            "physics",
          ],
          ["الرياضيات التطبيقية", "الوحدة الثانية: التفاضل", 42, "math"],
          [
            "الكيمياء العضوية",
            "الوحدة الرابعة: الهيدروكربونات",
            81,
            "chemistry",
          ],
        ].map(([title, lesson, progress, tone]) => (
          <article className="card enrolled-course" key={String(title)}>
            <div className={`course-art ${tone}`}>
              <BookOpen size={34} />
              <Badge tone="blue">{progress}% مكتمل</Badge>
            </div>
            <h3>{String(title)}</h3>
            <p>{String(lesson)}</p>
            <Progress value={Number(progress)} />
            <div>
              <small>{progress}% من الدورة</small>
              <Button
                variant="ghost"
                icon={Play}
                onClick={() => open("course-details")}
              >
                متابعة
              </Button>
            </div>
          </article>
        ))}
      </section>
      <section className="student-bottom">
        <article className="card tasks">
          <div className="card-header">
            <div>
              <h2>المهام القادمة</h2>
              <p>لا تفوّت مواعيدك المهمة</p>
            </div>
            <CalendarDays size={20} />
          </div>
          {[
            ["اختبار قوانين الحركة", "غداً · 7:00 م", "orange"],
            ["تسليم واجب الرياضيات", "الخميس · 9:00 م", "blue"],
            ["حصة الكيمياء المباشرة", "السبت · 5:00 م", "green"],
          ].map(([name, date, tone]) => (
            <button
              onClick={() =>
                name.includes("اختبار")
                  ? navigate("student-exam")
                  : open("course-details")
              }
              key={name}
            >
              <i className={tone} />
              <span>
                <b>{name}</b>
                <small>{date}</small>
              </span>
              <ChevronLeft size={16} />
            </button>
          ))}
        </article>
        <article className="card score-widget">
          <div>
            <span>
              <Award size={25} />
            </span>
            <b className="latin">86%</b>
            <small>متوسط درجاتك</small>
          </div>
          <p>أداؤك أعلى من متوسط المجموعة بـ 8%</p>
          <Button variant="secondary" onClick={() => open("filter")}>
            عرض تقرير الأداء
          </Button>
        </article>
      </section>
    </>
  )
}

function StudentCourses({ open }: { open: (modal: ModalType) => void }) {
  const [lesson, setLesson] = useState(0)
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <PageHeader
        title="فيزياء الصف الثالث الثانوي"
        description="أ. أحمد محمود · 32 درساً · 24 ساعة"
        actions={
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => open("course-details")}
          >
            ملفات الدورة
          </Button>
        }
      />
      <div className="lesson-viewer">
        <aside className="card course-outline">
          <h2>محتوى الدورة</h2>
          <Progress value={68} />
          <small>اكتمل 18 من 32 درساً</small>
          {[
            "مقدمة عن قوانين نيوتن",
            "قانون نيوتن الأول",
            "قانون نيوتن الثاني",
            "تطبيقات ومسائل",
            "اختبار الوحدة",
          ].map((name, index) => (
            <button
              className={lesson === index ? "active" : ""}
              onClick={() => setLesson(index)}
              key={name}
            >
              <span>
                {index < 2 ? (
                  <Check size={14} />
                ) : index === 4 ? (
                  <PenLine size={14} />
                ) : (
                  <Play size={14} />
                )}
              </span>
              <div>
                <b>{name}</b>
                <small>
                  {index === 4 ? "10 أسئلة" : `${12 + index * 2} دقيقة`}
                </small>
              </div>
            </button>
          ))}
        </aside>
        <section className="video-section">
          <div className={`web-video ${playing ? "playing" : ""}`}>
            <div className="video-formula">F = ma</div>
            <span className="watermark">عمر أحمد · 0102•••6789</span>
            <button
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? "إيقاف الفيديو" : "تشغيل الفيديو"}
            >
              {playing ? (
                <span className="pause-symbol" />
              ) : (
                <Play size={30} fill="currentColor" />
              )}
            </button>
            <div className="video-bar">
              <Play size={17} />
              <i>
                <i />
              </i>
              <span className="latin">08:24 / 18:30</span>
              <ShieldCheck size={17} />
            </div>
          </div>
          <article className="card lesson-info">
            <Badge tone="blue">الوحدة الثالثة</Badge>
            <h2>
              {
                [
                  "مقدمة عن قوانين نيوتن",
                  "قانون نيوتن الأول",
                  "قانون نيوتن الثاني",
                  "تطبيقات ومسائل",
                  "اختبار الوحدة",
                ][lesson]
              }
            </h2>
            <p>
              تعرف في هذا الدرس على المفاهيم الأساسية وكيفية تطبيق القانون على
              المسائل المختلفة بطريقة مبسطة.
            </p>
            <div>
              <Button
                variant="secondary"
                onClick={() => setLesson(Math.max(0, lesson - 1))}
              >
                الدرس السابق
              </Button>
              <Button onClick={() => setLesson(Math.min(4, lesson + 1))}>
                الدرس التالي <ArrowLeft size={16} />
              </Button>
            </div>
          </article>
        </section>
      </div>
    </>
  )
}

function StudentExam({
  completedAttempts,
  saveAttempt,
}: {
  completedAttempts: Record<string, StudentExamAttempt>
  saveAttempt: (examId: string, attempt: StudentExamAttempt) => void
}) {
  const [panel, setPanel] = useState<"list" | "taking" | "review" | "result">(
    "list",
  )
  const [selectedExamId, setSelectedExamId] = useState("motion-open")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([])
  const examSchedule: {
    id: string
    title: string
    course: string
    schedule: string
    status: "open" | "upcoming" | "completed"
    questions: number
    duration: number
    score?: number
  }[] = [
    {
      id: "motion-open",
      title: "اختبار قوانين الحركة",
      course: "فيزياء الصف الثالث الثانوي",
      schedule: "متاح الآن · آخر موعد اليوم، 8:00 م",
      status: "open" as const,
      questions: 3,
      duration: 15,
    },
    {
      id: "vectors-upcoming",
      title: "اختبار المتجهات",
      course: "فيزياء الصف الثالث الثانوي",
      schedule: "غداً · 7:00 م",
      status: "upcoming" as const,
      questions: 10,
      duration: 30,
    },
    {
      id: "measurement-completed",
      title: "اختبار القياس والحركة",
      course: "فيزياء الصف الثالث الثانوي",
      schedule: "20 يونيو 2025",
      status: "completed" as const,
      questions: 10,
      duration: 30,
      score: 78,
    },
  ]
  const exams = examSchedule.map((exam) => {
    const attempt = completedAttempts[exam.id]
    return attempt
      ? {
          ...exam,
          schedule: "تم التسليم الآن",
          status: "completed" as const,
          score: attempt.score,
        }
      : exam
  })
  const questions = [
    {
      prompt: "أي من الكميات الآتية تُعد كمية متجهة؟",
      answers: ["المسافة", "الإزاحة", "الزمن", "الكتلة"],
      correct: 1,
    },
    {
      prompt: "ما وحدة قياس القوة في النظام الدولي؟",
      answers: ["الجول", "النيوتن", "الواط", "الكيلوجرام"],
      correct: 1,
    },
    {
      prompt: "إذا أثرت قوة محصلة في جسم، فإن الجسم يكتسب:",
      answers: ["كتلة", "طاقة حرارية", "عجلة", "حجماً"],
      correct: 2,
    },
  ]
  const selectedExam =
    exams.find((exam) => exam.id === selectedExamId) ?? exams[0]
  const savedAttempt = completedAttempts[selectedExamId]
  const answeredCount = Object.keys(answers).length
  const score = Math.round(
    (questions.filter((question, index) => answers[index] === question.correct)
      .length /
      questions.length) *
      100,
  )
  const startExam = (examId: string) => {
    setSelectedExamId(examId)
    setAnswers({})
    setMarkedQuestions([])
    setQuestionIndex(0)
    setPanel("taking")
  }
  const toggleMarkedQuestion = () => {
    setMarkedQuestions((marked) =>
      marked.includes(questionIndex)
        ? marked.filter((index) => index !== questionIndex)
        : [...marked, questionIndex],
    )
  }
  const reviewPreviousExam = (examId: string) => {
    setSelectedExamId(examId)
    setAnswers(completedAttempts[examId]?.answers ?? {})
    setPanel("review")
  }
  const submitExam = () => {
    saveAttempt(selectedExamId, { score, answers: { ...answers } })
    setPanel("result")
  }

  if (panel === "taking") {
    const question = questions[questionIndex]
    return (
      <>
        <PageHeader
          title={selectedExam.title}
          description={`${questions.length} أسئلة · ${selectedExam.duration} دقيقة · محاولة واحدة`}
          actions={
            <Badge tone="orange">
              <Clock3 size={15} />
              <span className="latin">15:00</span> متبقية
            </Badge>
          }
        />
        <div className="exam-layout">
          <section className="card exam-paper">
            <div className="exam-progress">
              <span>
                السؤال {questionIndex + 1} من {questions.length}
              </span>
              <b>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</b>
              <Progress
                value={((questionIndex + 1) / questions.length) * 100}
              />
            </div>
            <Badge>درجة واحدة</Badge>
            <h2>{question.prompt}</h2>
            {question.answers.map((answer, index) => (
              <button
                className={`answer ${answers[questionIndex] === index ? "selected" : ""}`}
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [questionIndex]: index,
                  }))
                }
                key={answer}
              >
                <span>{answers[questionIndex] === index && <i />}</span>
                {answer}
              </button>
            ))}
            <footer>
              <Button
                variant="secondary"
                onClick={toggleMarkedQuestion}
              >
                {markedQuestions.includes(questionIndex)
                  ? "إزالة علامة المراجعة"
                  : "وضع علامة للمراجعة"}
              </Button>
              {questionIndex < questions.length - 1 ? (
                <Button onClick={() => setQuestionIndex((index) => index + 1)}>
                  السؤال التالي <ArrowLeft size={16} />
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={submitExam}
                  disabled={answeredCount === 0}
                >
                  تسليم الاختبار
                </Button>
              )}
            </footer>
          </section>
          <aside className="card question-map">
            <h2>خريطة الأسئلة</h2>
            <div>
              {questions.map((_, index) => (
                <button
                  className={[
                    answers[index] !== undefined ? "answered" : "",
                    questionIndex === index ? "current" : "",
                    markedQuestions.includes(index) ? "marked" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setQuestionIndex(index)}
                  key={index}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <span>
              <i className="answered" />
              تمت الإجابة
            </span>
            <span>
              <i className="current" />
              السؤال الحالي
            </span>
            <span>
              <i />
              لم تتم الإجابة
            </span>
            <Button
              variant="danger"
              onClick={submitExam}
              disabled={answeredCount === 0}
            >
              تسليم الاختبار
            </Button>
          </aside>
        </div>
      </>
    )
  }

  if (panel === "review" || panel === "result") {
    const isPastResult = panel === "review"
    const resultScore = isPastResult ? selectedExam.score ?? 78 : score
    const mistakes = isPastResult
      ? savedAttempt
        ? questions.flatMap((question, index) =>
            savedAttempt.answers[index] === question.correct
              ? []
              : [
                  {
                    prompt: question.prompt,
                    chosen:
                      savedAttempt.answers[index] === undefined
                        ? "لم تتم الإجابة"
                        : question.answers[savedAttempt.answers[index]],
                    correct: question.answers[question.correct],
                  },
                ],
          )
        : [
          {
            prompt: "ما وحدة قياس الإزاحة؟",
            chosen: "المتر لكل ثانية",
            correct: "المتر",
          },
          {
            prompt: "أي الكميات التالية قياسية؟",
            chosen: "السرعة المتجهة",
            correct: "الزمن",
          },
        ]
      : questions.flatMap((question, index) =>
          answers[index] === question.correct
            ? []
            : [
                {
                  prompt: question.prompt,
                  chosen:
                    answers[index] === undefined
                      ? "لم تتم الإجابة"
                      : question.answers[answers[index]],
                  correct: question.answers[question.correct],
                },
              ],
        )
    return (
      <>
        <PageHeader
          title={isPastResult ? selectedExam.title : "نتيجة الاختبار"}
          description={
            isPastResult
              ? `نتيجة ${selectedExam.schedule} · ${selectedExam.course}`
              : "تم تسليم إجاباتك، ويمكنك مراجعة الإجابات والأخطاء."
          }
          actions={
            <Button variant="secondary" onClick={() => setPanel("list")}>
              <ArrowLeft size={16} /> العودة للاختبارات
            </Button>
          }
        />
        <section className="card exam-result">
          <div className="exam-result-score">
            <span className="notice-icon blue">
              <Award size={24} />
            </span>
            <div>
              <small>الدرجة النهائية</small>
              <strong className="latin">{resultScore}%</strong>
            </div>
            <Badge tone={resultScore >= 60 ? "green" : "orange"}>
              {resultScore >= 60 ? "اجتياز" : "تحتاج إلى مراجعة"}
            </Badge>
          </div>
          <h2>مراجعة الإجابات والأخطاء</h2>
          {mistakes.length ? (
            mistakes.map((mistake) => (
              <article className="exam-mistake" key={mistake.prompt}>
                <b>{mistake.prompt}</b>
                <p>
                  إجابتك: <span>{mistake.chosen}</span>
                </p>
                <p>
                  الإجابة الصحيحة: <strong>{mistake.correct}</strong>
                </p>
              </article>
            ))
          ) : (
            <div className="calendar-no-absence">
              <CheckCircle2 size={19} />
              <span>أحسنت! لم تسجل أخطاء في هذا الاختبار.</span>
            </div>
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="الاختبارات"
        description="تابع اختباراتك القادمة، وابدأ المتاح منها، وراجع نتائجك السابقة."
        actions={<Badge tone="orange">اختبار متاح الآن</Badge>}
      />
      <section className="student-exam-list">
        {exams.map((exam) => (
          <article className="card student-exam-card" key={exam.id}>
            <div className="student-exam-icon">
              {exam.status === "completed" ? (
                <Award size={22} />
              ) : exam.status === "open" ? (
                <PenLine size={22} />
              ) : (
                <CalendarDays size={22} />
              )}
            </div>
            <div className="student-exam-info">
              <div className="student-exam-title">
                <h2>{exam.title}</h2>
                <Badge
                  tone={
                    exam.status === "open"
                      ? "green"
                      : exam.status === "upcoming"
                        ? "blue"
                        : "neutral"
                  }
                >
                  {exam.status === "open"
                    ? "متاح الآن"
                    : exam.status === "upcoming"
                      ? "قادم"
                      : "مكتمل"}
                </Badge>
              </div>
              <p>{exam.course}</p>
              <div className="student-exam-meta">
                <span>
                  <CalendarDays size={15} /> {exam.schedule}
                </span>
                <span>
                  <FileText size={15} /> {exam.questions} أسئلة
                </span>
                <span>
                  <Clock3 size={15} /> {exam.duration} دقيقة
                </span>
                {exam.status === "completed" && (
                  <strong className="latin">درجتك: {exam.score}%</strong>
                )}
              </div>
            </div>
            {exam.status === "open" ? (
              <Button icon={Play} onClick={() => startExam(exam.id)}>
                ابدأ الحل
              </Button>
            ) : exam.status === "completed" ? (
              <Button
                variant="secondary"
                icon={FileText}
                onClick={() => reviewPreviousExam(exam.id)}
              >
                النتيجة والأخطاء
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                لم يبدأ بعد
              </Button>
            )}
          </article>
        ))}
      </section>
    </>
  )
}

function StudentPass({ open }: { open: (modal: ModalType) => void }) {
  return (
    <>
      <PageHeader
        title="بطاقة الطالب والمحفظة"
        description="استخدم رمزك عند دخول السنتر وتابع رصيدك."
        actions={
          <Button icon={Wallet} onClick={() => open("recharge")}>
            شحن المحفظة
          </Button>
        }
      />
      <div className="pass-layout">
        <article className="student-pass">
          <header>
            <Brand />
            <Badge tone="green">طالب نشط</Badge>
          </header>
          <div className="pass-person">
            <span className="avatar">عخ</span>
            <div>
              <h2>عمر أحمد إبراهيم</h2>
              <p>الصف الثالث الثانوي · مجموعة السبت</p>
            </div>
          </div>
          <div className="qr-visual">
            {Array.from({ length: 81 }, (_, index) => (
              <i
                className={
                  index % 3 === 0 ||
                  index % 7 === 0 ||
                  [1, 2, 9, 10, 18, 19, 63, 64, 72, 73].includes(index)
                    ? "filled"
                    : ""
                }
                key={index}
              />
            ))}
          </div>
          <strong className="latin">STU-284-937</strong>
          <p>امسح الرمز لتسجيل الحضور</p>
        </article>
        <section>
          <article className="wallet-card">
            <span>
              <small>رصيد المحفظة</small>
              <strong className="latin">125 ج.م</strong>
            </span>
            <Wallet size={38} />
            <div>
              <small>آخر شحن</small>
              <b className="latin">+200 ج.م · 20 يونيو</b>
            </div>
          </article>
          <article className="card pass-history">
            <div className="card-header">
              <div>
                <h2>آخر العمليات</h2>
                <p>حركة المحفظة الأخيرة</p>
              </div>
              <Button variant="ghost" onClick={() => open("payment-details")}>
                عرض الكل
              </Button>
            </div>
            {[
              ["شحن كارت", "+200 ج.م", "green"],
              ["اشتراك مراجعة", "-150 ج.م", "red"],
              ["مكافأة تفوق", "+25 ج.م", "blue"],
            ].map(([name, amount, tone]) => (
              <div key={name}>
                <span className={`notice-icon ${tone}`}>
                  <Wallet size={17} />
                </span>
                <b>{name}</b>
                <strong className={tone}>{amount}</strong>
              </div>
            ))}
          </article>
        </section>
      </div>
    </>
  )
}

function ParentPortal({
  view,
  open,
  openPaymentDetails,
  openExcuse,
  childId,
  setChildId,
}: {
  view: View
  open: (modal: ModalType) => void
  openPaymentDetails: (details: ParentPaymentDetails) => void
  openExcuse: (details: ExcuseDetails) => void
  childId: ParentChildId
  setChildId: (childId: ParentChildId) => void
}) {
  if (view === "parent-attendance")
    return (
      <ParentAttendance
        open={open}
        openExcuse={openExcuse}
        childId={childId}
        setChildId={setChildId}
      />
    )
  if (view === "parent-payments")
    return (
      <ParentPayments
        open={open}
        openPaymentDetails={openPaymentDetails}
        childId={childId}
        setChildId={setChildId}
      />
    )
  return <ParentHome open={open} childId={childId} setChildId={setChildId} />
}

function ChildSelector({
  childId,
  setChildId,
}: {
  childId: ParentChildId
  setChildId: (childId: ParentChildId) => void
}) {
  return (
    <Select
      value={childId}
      onChange={(value) => {
        if (value === "omar" || value === "salma") setChildId(value)
      }}
    >
      <option value="omar">عمر أحمد · الصف الثالث الثانوي</option>
      <option value="salma">سلمى أحمد · الصف الأول الثانوي</option>
    </Select>
  )
}

function ParentHome({
  open,
  childId,
  setChildId,
}: {
  open: (modal: ModalType) => void
  childId: ParentChildId
  setChildId: (childId: ParentChildId) => void
}) {
  const child = parentChildren[childId]
  return (
    <>
      <PageHeader
        title={`متابعة أداء ${child.name}`}
        description={`ملخص محدث لأداء ${child.name} خلال الشهر الحالي.`}
        actions={<ChildSelector childId={childId} setChildId={setChildId} />}
      />
      <section className="stats-grid">
        <StatCard
          icon={Award}
          label="متوسط الدرجات"
          value={`${child.average}%`}
          change={child.averageChange}
          tone="blue"
        />
        <StatCard
          icon={UserCheck}
          label="نسبة الحضور"
          value={`${child.attendance}%`}
          change={child.attendanceChange}
          tone="green"
        />
        <StatCard
          icon={BookOpen}
          label="الدروس المكتملة"
          value={`${child.lessonsCompleted} / ${child.totalLessons}`}
          change={`${Math.round((child.lessonsCompleted / child.totalLessons) * 100)}%`}
          tone="navy"
        />
        <StatCard
          icon={Clock3}
          label="وقت التعلّم"
          value={`${child.learningHours} ساعة`}
          change={child.learningChange}
          tone="orange"
        />
      </section>
      <div className="parent-performance">
        <article className="card performance-chart">
          <div className="card-header">
            <div>
              <h2>تطور الدرجات</h2>
              <p>مقارنة أداء {child.name} بمتوسط المجموعة</p>
            </div>
            <Button
              variant="secondary"
              icon={Filter}
              onClick={() => open("filter")}
            >
              تصفية
            </Button>
          </div>
          <div className="performance-legend">
            <span>
              <i />
              {child.name}
            </span>
            <span>
              <i />
              متوسط المجموعة
            </span>
          </div>
          <svg viewBox="0 0 700 250" preserveAspectRatio="none">
            <path
              className="average-line"
              d="M0 195 C120 180 190 145 280 158 S470 115 700 104"
            />
            <path className="child-line" d={child.scorePath} />
            <circle cx="700" cy={child.scoreEndpoint} r="6" />
          </svg>
          <div className="performance-months">
            {["فبراير", "مارس", "أبريل", "مايو", "يونيو"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </article>
        <article className="card subject-list">
          <div className="card-header">
            <div>
              <h2>أداء المواد</h2>
              <p>الدرجات حسب المادة</p>
            </div>
            <Award size={21} />
          </div>
          {child.subjects.map(([subject, score, label]) => (
            <div key={String(subject)}>
              <span>
                <b>{subject}</b>
                <small>{label}</small>
              </span>
              <Progress
                value={Number(score)}
                tone={Number(score) > 85 ? "green" : "blue"}
              />
              <strong className="latin">{score}%</strong>
            </div>
          ))}
        </article>
      </div>
      <article className="card parent-alert">
        <span>
          <CheckCircle2 size={23} />
        </span>
        <div>
          <b>أداء {child.name} يتحسن باستمرار</b>
          <p>
            ارتفع متوسطه {child.averageChange.replace("+", "")} مقارنة بالشهر الماضي، مع نسبة حضور {child.attendance}%.
          </p>
        </div>
        <Button variant="secondary" onClick={() => open("filter")}>
          عرض التقرير الكامل
        </Button>
      </article>
    </>
  )
}

function ParentAttendance({
  open,
  openExcuse,
  childId,
  setChildId,
}: {
  open: (modal: ModalType) => void
  openExcuse: (details: ExcuseDetails) => void
  childId: ParentChildId
  setChildId: (childId: ParentChildId) => void
}) {
  const child = parentChildren[childId]
  const [displayMonth, setDisplayMonth] = useState(() => new Date(2025, 5, 1))
  const firstDay = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth(),
    1,
  )
  const daysInMonth = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth() + 1,
    0,
  ).getDate()
  const leadingDays = (firstDay.getDay() + 1) % 7
  const trailingDays = (7 - ((leadingDays + daysInMonth) % 7)) % 7
  const isSampleDataMonth =
    displayMonth.getFullYear() === 2025 && displayMonth.getMonth() === 5
  const attendedDays = isSampleDataMonth ? child.attendedDays : []
  const absentDays = isSampleDataMonth ? child.absentDays : []
  const onlineDays = isSampleDataMonth ? child.onlineDays : []
  const days: (number | null)[] = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ...Array.from({ length: trailingDays }, () => null),
  ]
  const monthLabel = new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    year: "numeric",
  }).format(displayMonth)
  const changeMonth = (difference: number) => {
    setDisplayMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + difference,
          1,
        ),
    )
  }
  const attendanceSummary: [string, string, string, LucideIcon][] = [
    ["أيام الحضور", String(attendedDays.length), "green", UserCheck],
    ["أيام الغياب", String(absentDays.length), "red", X],
    ["حصص أونلاين", String(onlineDays.length), "blue", MonitorPlay],
  ]
  return (
    <>
      <PageHeader
        title="الحضور والغياب"
        description={`تابع سجل حضور ${child.name} في السنتر والحصص الأونلاين.`}
        actions={
          <>
            <ChildSelector childId={childId} setChildId={setChildId} />
            <Button
              variant="secondary"
              icon={Filter}
              onClick={() => open("filter")}
            >
              تصفية
            </Button>
          </>
        }
      />
      <div className="attendance-calendar-layout">
        <article className="card parent-calendar">
          <header>
            <IconButton
              icon={ChevronRight}
              label="الشهر التالي"
              onClick={() => changeMonth(1)}
            />
            <h2>{monthLabel}</h2>
            <IconButton
              icon={ChevronLeft}
              label="الشهر السابق"
              onClick={() => changeMonth(-1)}
            />
          </header>
          <div className="calendar-legend">
            <span>
              <i className="present" />
              حاضر
            </span>
            <span>
              <i className="absent" />
              غائب
            </span>
            <span>
              <i className="online" />
              أونلاين
            </span>
          </div>
          <div className="weekdays">
            {["س", "ح", "ن", "ث", "ر", "خ", "ج"].map((day) => (
              <b key={day}>{day}</b>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day, index) => {
              const state =
                day === null
                  ? ""
                  : attendedDays.includes(day)
                    ? "present"
                    : absentDays.includes(day)
                      ? "absent"
                      : onlineDays.includes(day)
                        ? "online"
                        : ""
              return (
                <span
                  className={state}
                  key={`${displayMonth.getFullYear()}-${displayMonth.getMonth()}-${index}`}
                >
                  {day ?? ""}
                </span>
              )
            })}
          </div>
        </article>
        <aside className="card attendance-summary-list">
          <h2>ملخص الشهر</h2>
          {attendanceSummary.map(([label, count, tone, Icon]) => {
            return (
              <div key={String(label)}>
                <span className={`notice-icon ${tone}`}>
                  <Icon size={18} />
                </span>
                <span>
                  <b>{label}</b>
                  <small>
                    من{" "}
                    {attendedDays.length + absentDays.length + onlineDays.length}{" "}
                    حصة
                  </small>
                </span>
                <strong className="latin">{count}</strong>
              </div>
            )
          })}
          <hr />
          {absentDays.length > 0 ? (
            <div className="absence-detail">
              <Badge tone="red">غياب</Badge>
              <b>
                {new Intl.DateTimeFormat("ar-EG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(
                  new Date(
                    displayMonth.getFullYear(),
                    displayMonth.getMonth(),
                    absentDays[0],
                  ),
                )}
              </b>
              <p>
                حصة {childId === "omar" ? "الفيزياء" : "الرياضيات"} · لم يتم
                إضافة عذر
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  openExcuse({
                    student: child.name,
                    date: new Intl.DateTimeFormat("ar-EG", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }).format(
                      new Date(
                        displayMonth.getFullYear(),
                        displayMonth.getMonth(),
                        absentDays[0],
                      ),
                    ),
                    lesson: childId === "omar" ? "الفيزياء" : "الرياضيات",
                  })
                }
              >
                إضافة عذر
              </Button>
            </div>
          ) : (
            <div className="calendar-no-absence">
              <CheckCircle2 size={19} />
              <span>لا يوجد غياب مسجّل في هذا الشهر.</span>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

function ParentPayments({
  open,
  openPaymentDetails,
  childId,
  setChildId,
}: {
  open: (modal: ModalType) => void
  openPaymentDetails: (details: ParentPaymentDetails) => void
  childId: ParentChildId
  setChildId: (childId: ParentChildId) => void
}) {
  const child = parentChildren[childId]
  const transactions =
    childId === "omar"
      ? [
          ["اشتراك فيزياء · يونيو", "2 يونيو 2025", "بطاقة بنكية", "450 ج.م"],
          ["حصة مراجعة نهائية", "28 مايو 2025", "فوري", "150 ج.م"],
          ["اشتراك فيزياء · مايو", "1 مايو 2025", "بطاقة بنكية", "450 ج.م"],
        ]
      : [
          ["اشتراك رياضيات · يونيو", "3 يونيو 2025", "محفظة", "380 ج.م"],
          ["اختبار كيمياء تجريبي", "22 مايو 2025", "بطاقة بنكية", "120 ج.م"],
          ["اشتراك رياضيات · مايو", "1 مايو 2025", "محفظة", "380 ج.م"],
        ]
  return (
    <>
      <PageHeader
        title="المدفوعات والاشتراكات"
        description={`تابع مدفوعات واشتراكات ${child.name}.`}
        actions={
          <>
            <ChildSelector childId={childId} setChildId={setChildId} />
            <Button
              variant="secondary"
              icon={Download}
              onClick={() => open("export")}
            >
              تصدير الكشف
            </Button>
          </>
        }
      />
      <section className="payment-summary">
        <article>
          <span>
            <WalletCards size={23} />
          </span>
          <div>
            <small>إجمالي المدفوعات هذا العام</small>
            <strong className="latin">
              {childId === "omar" ? "6,850" : "4,260"} ج.م
            </strong>
          </div>
        </article>
        <article>
          <span>
            <CheckCircle2 size={23} />
          </span>
          <div>
            <small>الاشتراكات النشطة</small>
            <strong className="latin">{childId === "omar" ? "3" : "2"}</strong>
          </div>
        </article>
        <article>
          <span>
            <CalendarDays size={23} />
          </span>
          <div>
            <small>الدفعة القادمة</small>
            <strong className="latin">
              {childId === "omar" ? "450" : "380"} ج.م
            </strong>
            <small>1 يوليو</small>
          </div>
        </article>
      </section>
      <article className="card">
        <div className="card-header">
          <div>
            <h2>سجل المدفوعات</h2>
            <p>جميع الفواتير والمعاملات المكتملة</p>
          </div>
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => open("filter")}
          >
            تصفية السجل
          </Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>البيان</th>
                <th>الطالب</th>
                <th>التاريخ</th>
                <th>طريقة الدفع</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {transactions.map(([description, date, method, amount]) => (
                <tr key={description}>
                  {[description, child.name, date, method, amount].map(
                    (cell, index) => (
                      <td key={cell}>
                        {index === 0 ? <b>{cell}</b> : cell}
                      </td>
                    ),
                  )}
                  <td>
                    <Badge tone="green">مكتملة</Badge>
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        openPaymentDetails({
                          description,
                          student: child.name,
                          date,
                          method,
                          amount,
                        })
                      }
                    >
                      التفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  )
}

function SupportCenter({ open }: { open: (modal: ModalType) => void }) {
  const [query, setQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const faqs = [
    [
      "كيف أشحن رصيد حسابي؟",
      "من صفحة بطاقة الطالب والمحفظة اضغط على شحن المحفظة، ثم اختر وسيلة الدفع وأدخل المبلغ.",
    ],
    [
      "لماذا لا يعمل الفيديو؟",
      "تأكد من اتصال الإنترنت واستخدام أحدث إصدار من المتصفح، ثم أعد تحميل الصفحة.",
    ],
    [
      "كيف أتابع حضور ابني؟",
      "يدخل ولي الأمر إلى صفحة الحضور والغياب لعرض التقويم الشهري وتفاصيل كل حصة.",
    ],
    [
      "كيف أغيّر مجموعة الطالب؟",
      "أرسل استفساراً إلى الدعم وحدد اسم الطالب والمجموعة الحالية والمجموعة المطلوبة.",
    ],
    [
      "متى تظهر نتيجة الاختبار؟",
      "تظهر نتيجة الأسئلة الموضوعية فور التسليم، وتُضاف درجة المقال بعد مراجعة المدرّس.",
    ],
  ]
  const visibleFaqs = faqs.filter(([question, answer]) =>
    `${question} ${answer}`.includes(query),
  )
  return (
    <>
      <section className="support-hero-web">
        <span>
          <Headphones size={28} />
        </span>
        <h1>كيف يمكننا مساعدتك؟</h1>
        <p>ابحث في قاعدة المعرفة أو تواصل مباشرة مع فريق الدعم.</p>
        <label>
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن سؤالك هنا..."
          />
        </label>
      </section>
      <section className="support-categories">
        {[
          [BookOpen, "الدروس والمحتوى", "المشاهدة، الملفات والتقدم"],
          [CreditCard, "الدفع والاشتراكات", "الشحن، الفواتير والتفعيل"],
          [Lock, "الحساب والأمان", "الدخول، كلمة المرور والبيانات"],
          [PenLine, "الاختبارات والنتائج", "التسليم، الدرجات والمحاولات"],
        ].map(([CategoryIcon, title, description]) => {
          const Icon = CategoryIcon as LucideIcon
          return (
            <button
              onClick={() => setQuery(String(title).split(" ")[0])}
              key={String(title)}
            >
              <span className="support-category-icon">
                <Icon size={22} />
              </span>
              <span className="support-category-copy">
                <b>{String(title)}</b>
                <small>{String(description)}</small>
              </span>
              <ChevronLeft size={17} />
            </button>
          )
        })}
      </section>
      <div className="support-layout">
        <article className="card faq-list">
          <div className="card-header">
            <div>
              <h2>الأسئلة الشائعة</h2>
              <p>إجابات سريعة عن أكثر الاستفسارات شيوعاً</p>
            </div>
            <HelpCircle size={21} />
          </div>
          {visibleFaqs.map(([question, answer], index) => (
            <div
              className={`faq-item ${openFaq === index ? "open" : ""}`}
              key={question}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{question}</span>
                <Plus size={18} />
              </button>
              {openFaq === index && <p>{answer}</p>}
            </div>
          ))}
          {visibleFaqs.length === 0 && (
            <div className="directory-empty">
              <Search size={25} />
              <b>لم نجد إجابة مطابقة</b>
              <span>يمكنك إرسال استفسارك مباشرة إلى فريق الدعم.</span>
            </div>
          )}
        </article>
        <aside className="support-contact">
          <article className="whatsapp-card">
            <span>
              <MessageCircle size={27} />
            </span>
            <h2>تحتاج مساعدة فورية؟</h2>
            <p>
              تواصل معنا عبر واتساب. فريق الدعم متاح يومياً من 9 صباحاً إلى 10
              مساءً.
            </p>
            <Button
              onClick={() =>
                window.open("https://wa.me/201000000000", "_blank")
              }
            >
              تواصل عبر واتساب
            </Button>
          </article>
          <article className="card ticket-card">
            <span>
              <Mail size={23} />
            </span>
            <div>
              <h2>أرسل استفسارك</h2>
              <p>سنرد عليك خلال 24 ساعة.</p>
            </div>
            <Button variant="secondary" onClick={() => open("support-ticket")}>
              إرسال استفسار
            </Button>
          </article>
        </aside>
      </div>
    </>
  )
}

function Modal({
  type,
  paymentDetails,
  excuseDetails,
  close,
  success,
}: {
  type: ModalType
  paymentDetails?: ParentPaymentDetails | null
  excuseDetails?: ExcuseDetails | null
  close: () => void
  success: (message: string) => void
}) {
  if (!type) return null
  const details = {
    course: [
      "إنشاء دورة جديدة",
      "أضف البيانات الأساسية للدورة وسيتم حفظها كمسودة.",
    ],
    lesson: ["إضافة محتوى جديد", "أضف درساً أو ملفاً إلى الوحدة الحالية."],
    group: [
      "إضافة مجموعة جديدة",
      "حدد بيانات المجموعة والجدول والسعة المتاحة.",
    ],
    "add-student": [
      "إضافة طالب جديد",
      "سجّل بيانات الطالب وأضفه إلى المجموعة المناسبة.",
    ],
    "support-ticket": [
      "إرسال استفسار",
      "اشرح المشكلة وسيقوم فريق الدعم بالرد خلال 24 ساعة.",
    ],
    "manual-attendance": [
      "تسجيل حضور يدوي",
      "ابحث عن الطالب وسجّل سبب التعديل.",
    ],
    question: ["إضافة سؤال", "أنشئ سؤالاً جديداً وأضفه إلى بنك الأسئلة."],
    exam: [
      "إنشاء امتحان جديد",
      "حدّد إعدادات الامتحان ثم أضف الأسئلة من البنك.",
    ],
    withdraw: ["طلب سحب الرصيد", "راجع بيانات التحويل قبل إرسال الطلب."],
    export: ["تصدير البيانات", "اختر نطاق وتنسيق الملف المطلوب."],
    profile: ["إعدادات الحساب", "حدّث بيانات ملفك الشخصي وتفضيلاتك."],
    "course-details": [
      "تفاصيل الدورة",
      "راجع محتوى الدورة والمدرّس قبل المتابعة.",
    ],
    recharge: ["شحن المحفظة", "اختر وسيلة الدفع وأدخل قيمة الشحن."],
    filter: ["تصفية النتائج", "حدّد المعايير التي تريد عرضها."],
    "payment-details": ["تفاصيل العملية", "معلومات الفاتورة وحالة الدفع."],
    excuse: ["إضافة عذر غياب", "أرسل عذر الغياب لمراجعته من إدارة المنصة."],
  }[type]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const message =
      type === "lesson"
        ? "تمت إضافة المحتوى بنجاح"
        : type === "excuse"
          ? "تم إرسال عذر الغياب للمراجعة"
          : type === "withdraw"
            ? "تم إرسال طلب السحب للمراجعة"
            : type === "export"
              ? "يجري تجهيز الملف للتحميل"
              : "تم حفظ التغييرات بنجاح"
    success(message)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.currentTarget === event.target && close()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={details[0]}
        dir={type === "course-details" ? "rtl" : undefined}
      >
        <header>
          <span>
            <h2>{details[0]}</h2>
            <p>{details[1]}</p>
          </span>
          <IconButton icon={X} label="إغلاق" onClick={close} />
        </header>
        <form onSubmit={submit}>
          <ModalFields
            type={type}
            paymentDetails={paymentDetails}
            excuseDetails={excuseDetails}
          />
          <footer>
            <Button variant="secondary" onClick={close}>
              إلغاء
            </Button>
            <Button type="submit" icon={type === "export" ? Download : Check}>
              {type === "export"
                ? "تصدير الملف"
                : type === "withdraw"
                  ? "إرسال الطلب"
                  : type === "recharge"
                    ? "تأكيد الشحن"
                    : type === "filter"
                      ? "تطبيق التصفية"
                      : type === "course-details"
                        ? "الاشتراك الآن"
                        : type === "payment-details"
                          ? "تحميل الفاتورة"
                          : type === "excuse"
                            ? "إرسال العذر"
                            : "حفظ"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  )
}

function ModalFields({
  type,
  paymentDetails,
  excuseDetails,
}: {
  type: Exclude<ModalType, null>
  paymentDetails?: ParentPaymentDetails | null
  excuseDetails?: ExcuseDetails | null
}) {
  if (type === "lesson")
    return (
      <>
        <div className="form-grid">
          <label className="field full">
            <span>عنوان الدرس</span>
            <input required placeholder="مثال: مقدمة في قوانين نيوتن" />
          </label>
          <label className="field full">
            <span>وصف الدرس</span>
            <textarea required placeholder="اكتب وصفاً مختصراً لمحتوى الدرس..." />
          </label>
          <label className="field">
            <span>نوع المحتوى</span>
            <Select defaultValue="video">
              <option value="video">فيديو</option>
              <option value="pdf">ملف PDF</option>
              <option value="quiz">اختبار</option>
            </Select>
          </label>
          <label className="field">
            <span>الوحدة</span>
            <Select defaultValue="motion">
              <option value="motion">الحركة في خط مستقيم</option>
              <option>قوانين نيوتن</option>
            </Select>
          </label>
        </div>
        <label className="file-drop">
          <input type="file" accept=".pdf,video/*,image/*" />
          <span>
            <Upload size={24} />
          </span>
          <b>اختر ملفاً أو اسحبه هنا</b>
          <small>PDF، MP4، صور · حتى 250 MB</small>
        </label>
      </>
    )
  if (type === "course")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>اسم الدورة</span>
          <input required placeholder="مثال: فيزياء الصف الثالث الثانوي" />
        </label>
        <label className="field full">
          <span>الوصف</span>
          <textarea required placeholder="نبذة واضحة عن الدورة وأهدافها..." />
        </label>
        <label className="field">
          <span>المرحلة</span>
          <Select>
            <option>الثانوية العامة</option>
            <option>الإعدادية</option>
          </Select>
        </label>
        <label className="field">
          <span>السعر</span>
          <input type="number" placeholder="450" />
        </label>
      </div>
    )
  if (type === "group")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>اسم المجموعة</span>
          <input required placeholder="مجموعة السبت - أ" />
        </label>
        <label className="field">
          <span>السنتر</span>
          <Select>
            <option>Education Platform - القاهرة</option>
            <option>فرع مدينة نصر</option>
          </Select>
        </label>
        <label className="field">
          <span>السعة القصوى</span>
          <input type="number" defaultValue="30" />
        </label>
        <label className="field">
          <span>اليوم</span>
          <Select>
            <option>السبت</option>
            <option>الأحد</option>
            <option>الثلاثاء</option>
          </Select>
        </label>
        <label className="field">
          <span>موعد الحصة</span>
          <input type="time" defaultValue="17:00" />
        </label>
      </div>
    )
  if (type === "add-student")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>اسم الطالب بالكامل</span>
          <input required placeholder="الاسم الرباعي" />
        </label>
        <label className="field">
          <span>رقم هاتف الطالب</span>
          <input required type="tel" placeholder="01xxxxxxxxx" />
        </label>
        <label className="field">
          <span>رقم هاتف ولي الأمر</span>
          <input required type="tel" placeholder="01xxxxxxxxx" />
        </label>
        <label className="field">
          <span>الصف الدراسي</span>
          <Select>
            <option>الصف الثالث الثانوي</option>
            <option>الصف الثاني الثانوي</option>
            <option>الصف الأول الثانوي</option>
          </Select>
        </label>
        <label className="field">
          <span>المجموعة</span>
          <Select>
            <option>مجموعة السبت</option>
            <option>مجموعة الأحد</option>
            <option>مجموعة الثلاثاء</option>
          </Select>
        </label>
        <label className="field full">
          <span>السنتر</span>
          <Select>
            <option>سنتر القاهرة</option>
            <option>فرع مدينة نصر</option>
          </Select>
        </label>
        <label className="field full">
          <span>ملاحظات</span>
          <textarea placeholder="أي ملاحظات إدارية أو تعليمية عن الطالب..." />
        </label>
      </div>
    )
  if (type === "support-ticket")
    return (
      <div className="form-grid">
        <label className="field">
          <span>نوع الحساب</span>
          <Select>
            <option>طالب</option>
            <option>ولي أمر</option>
          </Select>
        </label>
        <label className="field">
          <span>القسم</span>
          <Select>
            <option>الدروس والمحتوى</option>
            <option>الدفع والاشتراكات</option>
            <option>الحساب والأمان</option>
            <option>الاختبارات</option>
          </Select>
        </label>
        <label className="field full">
          <span>عنوان الاستفسار</span>
          <input required placeholder="اكتب عنواناً مختصراً وواضحاً" />
        </label>
        <label className="field full">
          <span>تفاصيل المشكلة</span>
          <textarea
            required
            placeholder="اشرح ما حدث والخطوات التي قمت بها..."
          />
        </label>
        <label className="file-drop full">
          <input type="file" accept="image/*,.pdf" />
          <span>
            <Upload size={23} />
          </span>
          <b>إرفاق صورة أو ملف</b>
          <small>PNG، JPG أو PDF حتى 5 MB</small>
        </label>
        <div className="audit-note full">
          <Clock3 size={19} />
          <span>
            <b>متوسط وقت الرد: أقل من 24 ساعة</b>
            <small>ستصلك رسالة على رقم الهاتف المسجل عند الرد.</small>
          </span>
        </div>
      </div>
    )
  if (type === "manual-attendance")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>الطالب</span>
          <span className="search-input">
            <Search size={18} />
            <input required placeholder="ابحث بالاسم أو رقم الهاتف..." />
          </span>
        </label>
        <div className="student-result full">
          <span className="avatar">ع خ</span>
          <span>
            <b>عمر أحمد إبراهيم</b>
            <small>الصف الثالث الثانوي · مجموعة السبت</small>
          </span>
          <CheckCircle2 size={20} />
        </div>
        <label className="field full">
          <span>سبب التسجيل اليدوي</span>
          <textarea required placeholder="اكتب سبب تعذّر استخدام رمز QR..." />
        </label>
        <div className="audit-note full">
          <ShieldCheck size={19} />
          <span>
            <b>إجراء موثّق</b>
            <small>
              سيُحفظ اسم المستخدم ووقت التعديل والسبب في سجل المراجعة.
            </small>
          </span>
        </div>
      </div>
    )
  if (type === "question")
    return (
      <div className="form-grid">
        <label className="field">
          <span>نوع السؤال</span>
          <Select>
            <option>اختيار من متعدد</option>
            <option>سؤال مقالي</option>
          </Select>
        </label>
        <label className="field">
          <span>الوحدة</span>
          <Select>
            <option>قوانين نيوتن</option>
            <option>الحركة</option>
          </Select>
        </label>
        <label className="field full">
          <span>نص السؤال</span>
          <textarea
            required
            placeholder="اكتب السؤال هنا، ويمكنك استخدام الرموز والمعادلات..."
          />
        </label>
        {[
          "الإجابة الأولى",
          "الإجابة الثانية",
          "الإجابة الثالثة",
          "الإجابة الرابعة",
        ].map((label, index) => (
          <label className="field" key={label}>
            <span>{label}</span>
            <input required placeholder={`الخيار ${index + 1}`} />
          </label>
        ))}
      </div>
    )
  if (type === "exam")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>عنوان الامتحان</span>
          <input required placeholder="مثال: اختبار قوانين الحركة" />
        </label>
        <label className="field">
          <span>الدورة</span>
          <Select>
            <option>فيزياء الصف الثالث الثانوي</option>
            <option>أساسيات الميكانيكا</option>
          </Select>
        </label>
        <label className="field">
          <span>الوحدة</span>
          <Select>
            <option>قوانين نيوتن</option>
            <option>الحركة في خط مستقيم</option>
          </Select>
        </label>
        <label className="field">
          <span>مدة الامتحان بالدقائق</span>
          <input required type="number" defaultValue="30" />
        </label>
        <label className="field">
          <span>درجة النجاح</span>
          <input required type="number" defaultValue="60" />
        </label>
        <label className="field full">
          <span>موعد الإتاحة</span>
          <input required type="datetime-local" />
        </label>
        <div className="audit-note full">
          <PenLine size={19} />
          <span>
            <b>إضافة الأسئلة</b>
            <small>
              بعد الحفظ ستنتقل إلى بنك الأسئلة لاختيار الأسئلة وترتيبها.
            </small>
          </span>
        </div>
      </div>
    )
  if (type === "withdraw")
    return (
      <div className="form-grid">
        <div className="available-balance full">
          <span>الرصيد المتاح</span>
          <strong className="latin">163,925 ج.م</strong>
        </div>
        <label className="field full">
          <span>مبلغ السحب</span>
          <input
            required
            type="number"
            max="163925"
            placeholder="أدخل المبلغ"
          />
        </label>
        <label className="field full">
          <span>الحساب البنكي</span>
          <Select>
            <option>البنك الأهلي المصري · ينتهي بـ 4821</option>
          </Select>
        </label>
        <div className="audit-note full">
          <Clock3 size={19} />
          <span>
            <b>التحويل خلال 2-3 أيام عمل</b>
            <small>تُخصم رسوم تحويل ثابتة بقيمة 25 ج.م.</small>
          </span>
        </div>
      </div>
    )
  if (type === "export")
    return (
      <div className="form-grid">
        <label className="field full">
          <span>نوع التقرير</span>
          <Select>
            <option>تقرير شامل</option>
            <option>تقرير الحضور</option>
            <option>تقرير الإيرادات</option>
            <option>نتائج الطلاب</option>
          </Select>
        </label>
        <label className="field">
          <span>من تاريخ</span>
          <input type="date" />
        </label>
        <label className="field">
          <span>إلى تاريخ</span>
          <input type="date" />
        </label>
        <label className="field full">
          <span>صيغة الملف</span>
          <div className="format-options">
            <label>
              <input type="radio" name="format" defaultChecked /> Excel
            </label>
            <label>
              <input type="radio" name="format" /> PDF
            </label>
            <label>
              <input type="radio" name="format" /> CSV
            </label>
          </div>
        </label>
      </div>
    )
  if (type === "course-details")
    return (
      <div className="course-modal">
        <div className="course-modal-cover">
          <BookOpen size={50} />
          <span>
            <Play size={20} fill="currentColor" />
          </span>
        </div>
        <Badge tone="blue">الأكثر طلباً</Badge>
        <h2>فيزياء الصف الثالث الثانوي</h2>
        <p>
          شرح شامل وتدريبات عملية واختبارات دورية تساعدك على إتقان المنهج
          والاستعداد للامتحان.
        </p>
        <div className="course-modal-meta">
          <span>
            <Video size={17} />
            32 درساً
          </span>
          <span>
            <Clock3 size={17} />
            24 ساعة
          </span>
          <span>
            <Users size={17} />
            2.4K طالب
          </span>
        </div>
        <div className="course-price">
          <span>
            <small>سعر الدورة</small>
            <strong className="latin">450 ج.م</strong>
          </span>
          <Badge tone="green">اشتراك كامل</Badge>
        </div>
      </div>
    )
  if (type === "recharge")
    return (
      <div className="form-grid">
        <div className="available-balance full">
          <span>رصيدك الحالي</span>
          <strong className="latin">125 ج.م</strong>
        </div>
        <label className="field full">
          <span>قيمة الشحن</span>
          <input required type="number" placeholder="أدخل المبلغ بالجنيه" />
        </label>
        <label className="field full">
          <span>وسيلة الدفع</span>
          <Select>
            <option>بطاقة بنكية</option>
            <option>فوري</option>
            <option>محفظة إلكترونية</option>
            <option>كود شحن</option>
          </Select>
        </label>
        <label className="field full">
          <span>رقم البطاقة أو كود الشحن</span>
          <input required placeholder="•••• •••• •••• ••••" />
        </label>
        <div className="audit-note full">
          <ShieldCheck size={19} />
          <span>
            <b>دفع آمن ومشفّر</b>
            <small>سيتم تحديث رصيدك فور تأكيد العملية.</small>
          </span>
        </div>
      </div>
    )
  if (type === "filter")
    return (
      <div className="form-grid">
        <label className="field">
          <span>الفترة الزمنية</span>
          <Select>
            <option>آخر 30 يوماً</option>
            <option>هذا الفصل الدراسي</option>
            <option>هذا العام</option>
          </Select>
        </label>
        <label className="field">
          <span>الحالة</span>
          <Select>
            <option>كل الحالات</option>
            <option>مكتمل</option>
            <option>قيد التنفيذ</option>
          </Select>
        </label>
        <label className="field">
          <span>من تاريخ</span>
          <input type="date" />
        </label>
        <label className="field">
          <span>إلى تاريخ</span>
          <input type="date" />
        </label>
      </div>
    )
  if (type === "excuse")
    return (
      <div className="form-grid">
        <div className="audit-note full">
          <CalendarDays size={19} />
          <span>
            <b>{excuseDetails?.student ?? "الطالب"}</b>
            <small>
              غياب {excuseDetails?.date ?? ""} · حصة{" "}
              {excuseDetails?.lesson ?? ""}
            </small>
          </span>
        </div>
        <label className="field full">
          <span>سبب الغياب</span>
          <Select defaultValue="" required>
            <option value="" disabled>
              اختر سبب الغياب
            </option>
            <option>ظرف صحي</option>
            <option>ظرف عائلي</option>
            <option>سبب آخر</option>
          </Select>
        </label>
        <label className="field full">
          <span>تفاصيل العذر</span>
          <textarea
            required
            placeholder="اكتب تفاصيل العذر، ويمكنك ذكر أي معلومات تساعد في مراجعته..."
          />
        </label>
        <label className="field full">
          <span>مرفق داعم (اختياري)</span>
          <input type="file" accept="image/*,.pdf" />
        </label>
      </div>
    )
  if (type === "payment-details")
    return (
      <div className="payment-receipt">
        <span className="receipt-success">
          <CheckCircle2 size={28} />
        </span>
        <Badge tone="green">عملية مكتملة</Badge>
        <h2 className="latin">{paymentDetails?.amount ?? "450 ج.م"}</h2>
        <p>
          {paymentDetails?.description ??
            "اشتراك فيزياء الصف الثالث الثانوي · يونيو"}
        </p>
        {[
          ["رقم العملية", "#BD-824953"],
          ["الطالب", paymentDetails?.student ?? "عمر أحمد إبراهيم"],
          [
            "التاريخ",
            paymentDetails?.date ?? "2 يونيو 2025 · 10:42 ص",
          ],
          [
            "وسيلة الدفع",
            paymentDetails?.method ?? "بطاقة بنكية •••• 4821",
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b className="latin">{value}</b>
          </div>
        ))}
      </div>
    )
  return (
    <div className="form-grid">
      <label className="field full">
        <span>الاسم</span>
        <input defaultValue="Education Platform" />
      </label>
      <label className="field">
        <span>البريد الإلكتروني</span>
        <input type="email" defaultValue="admin@bdeveloper.com" />
      </label>
      <label className="field">
        <span>رقم الهاتف</span>
        <input type="tel" defaultValue="010 1234 5678" />
      </label>
      <label className="field full">
        <span>اللغة</span>
        <Select>
          <option>العربية</option>
          <option>English</option>
        </Select>
      </label>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    window.localStorage.getItem("education-platform-theme") === "dark"
      ? "dark"
      : "light",
  )
  const [portal, setPortal] = useState<Portal>("public")
  const [sessionName, setSessionName] = useState("")
  const [view, setView] = useState<View>("dashboard")
  const [modal, setModal] = useState<ModalType>(null)
  const [paymentDetails, setPaymentDetails] =
    useState<ParentPaymentDetails | null>(null)
  const [excuseDetails, setExcuseDetails] = useState<ExcuseDetails | null>(null)
  const [notifications, setNotifications] = useState(false)
  const [profile, setProfile] = useState<boolean>(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [parentChildId, setParentChildId] = useState<ParentChildId>("omar")
  const [toast, setToast] = useState("")
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem("education-platform-theme", theme)
  }, [theme])
  useEffect(() => {
    if (!profile) return
    const closeProfileMenu = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setProfile(false)
      }
    }
    const closeProfileMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfile(false)
    }
    document.addEventListener("pointerdown", closeProfileMenu)
    document.addEventListener("keydown", closeProfileMenuOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeProfileMenu)
      document.removeEventListener("keydown", closeProfileMenuOnEscape)
    }
  }, [profile])
  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
  const roleNavigation =
    portal === "student"
      ? studentNavigation
      : portal === "parent"
        ? parentNavigation
        : navigation
  const current =
    roleNavigation.find((item) => item.id === view) || roleNavigation[0]

  const showSuccess = (message: string) => {
    setModal(null)
    setPaymentDetails(null)
    setExcuseDetails(null)
    setToast(message)
    window.setTimeout(() => setToast(""), 3200)
  }
  const closeModal = () => {
    setModal(null)
    setPaymentDetails(null)
    setExcuseDetails(null)
  }
  const openParentPaymentDetails = (details: ParentPaymentDetails) => {
    setPaymentDetails(details)
    setModal("payment-details")
  }
  const openParentExcuse = (details: ExcuseDetails) => {
    setExcuseDetails(details)
    setModal("excuse")
  }

  const enterPortal = (nextPortal: Portal, name?: string) => {
    setProfile(false)
    setNotifications(false)
    setSessionName(name ?? "")
    setPortal(nextPortal)
    setView(
      nextPortal === "student"
        ? "student-home"
        : nextPortal === "parent"
          ? "parent-home"
          : "dashboard",
    )
  }

  if (portal === "public")
    return (
      <>
        <LandingPage
          login={() => setPortal("auth")}
          signup={() => setPortal("signup")}
          open={setModal}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <Modal
          type={modal}
          close={closeModal}
          paymentDetails={paymentDetails}
          excuseDetails={excuseDetails}
          success={showSuccess}
        />
        {toast && <Toast message={toast} close={() => setToast("")} />}
      </>
    )

  if (portal === "auth")
    return (
      <AuthPage
        enter={enterPortal}
        back={() => setPortal("public")}
        signup={() => setPortal("signup")}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )

  if (portal === "signup")
    return (
      <SignupPage
        enter={enterPortal}
        login={() => setPortal("auth")}
        back={() => setPortal("public")}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )

  const userName =
    sessionName ||
    (portal === "student"
      ? "عمر أحمد"
      : portal === "parent"
        ? "أحمد خالد"
        : "Education Platform")
  const userRole =
    portal === "student"
      ? "حساب الطالب"
      : portal === "parent"
        ? "حساب ولي الأمر"
        : "مدير المنصة"

  return (
    <div
      className={`app ${collapsed ? "collapsed" : ""} ${portal === "parent" ? "parent-portal" : ""}`}
      dir="rtl"
    >
      <aside className="sidebar">
        <div className="sidebar-head">
          <Brand compact={collapsed} />
          <IconButton
            icon={Menu}
            label="طي القائمة"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <nav>
          <span className="nav-label">القائمة الرئيسية</span>
          {roleNavigation.map((item) => {
            const NavIcon = item.icon
            return (
              <button
                className={view === item.id ? "active" : ""}
                onClick={() => {
                  setView(item.id)
                  setProfile(false)
                  setNotifications(false)
                }}
                key={item.id}
                title={item.label}
              >
                <NavIcon size={20} />
                <span>
                  <b>{item.label}</b>
                  <small>{item.description}</small>
                </span>
                <ChevronLeft size={16} />
              </button>
            )
          })}
        </nav>
        <button className="logout" onClick={() => setPortal("public")}>
          <LogOut size={19} />
          <span>تسجيل الخروج</span>
        </button>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="page-context">
            <h2>{current.label}</h2>
            <span>
              الرئيسية <ChevronLeft size={14} /> {current.label}
            </span>
          </div>
          <div className="top-actions">
            <label className="global-search">
              <Search size={18} />
              <input placeholder="ابحث في المنصة..." />
            </label>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="popover-anchor">
              <IconButton
                icon={Bell}
                label="الإشعارات"
                badge
                onClick={() => {
                  setNotifications(!notifications)
                  setProfile(false)
                }}
              />
              {notifications && (
                <Notifications close={() => setNotifications(false)} />
              )}
            </div>
            <div className="popover-anchor" ref={profileMenuRef}>
              <button
                className="profile-button"
                aria-expanded={profile}
                onClick={() => {
                  setProfile((isOpen) => !isOpen)
                  setNotifications(false)
                }}
              >
                <span className="avatar brand-avatar">BD</span>
                <span>
                  <b>{userName}</b>
                  <small>{userRole}</small>
                </span>
                <ChevronDown size={16} />
              </button>
              {profile && (
                <div className="profile-menu">
                  <button
                    onClick={() => {
                      setModal("profile")
                      setProfile(false)
                    }}
                  >
                    <Settings size={17} /> إعدادات الحساب
                  </button>
                  <button onClick={() => setPortal("public")}>
                    <LogOut size={17} /> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content">
          {view === "dashboard" && <Dashboard open={setModal} />}
          {view === "curriculum" && <Curriculum open={setModal} />}
          {view === "groups" && <Groups open={setModal} />}
          {view === "attendance" && <Attendance open={setModal} />}
          {view === "questions" && <Questions open={setModal} />}
          {view === "reports" && <Reports open={setModal} />}
          {view === "support" && <SupportCenter open={setModal} />}
          {portal === "student" && view !== "support" && (
            <StudentPortal
              view={view}
              open={setModal}
              navigate={setView}
            />
          )}
          {portal === "parent" && view !== "support" && (
            <ParentPortal
              view={view}
              open={setModal}
              openPaymentDetails={openParentPaymentDetails}
              openExcuse={openParentExcuse}
              childId={parentChildId}
              setChildId={setParentChildId}
            />
          )}
        </main>
      </div>
      <Modal
        type={modal}
        close={closeModal}
        paymentDetails={paymentDetails}
        excuseDetails={excuseDetails}
        success={showSuccess}
      />
      {toast && <Toast message={toast} close={() => setToast("")} />}
    </div>
  )
}

function Toast({ message, close }: { message: string; close: () => void }) {
  return (
    <div className="toast">
      <CheckCircle2 size={20} />
      <span>{message}</span>
      <button onClick={close}>
        <X size={16} />
      </button>
    </div>
  )
}

function Notifications({ close }: { close: () => void }) {
  return (
    <aside className="notification-popover">
      <header>
        <span>
          <b>الإشعارات</b>
          <small>لديك 3 إشعارات جديدة</small>
        </span>
        <button onClick={close}>
          <X size={17} />
        </button>
      </header>
      {[
        [
          UserCheck,
          "تم تسجيل حضور 28 طالباً",
          "مجموعة السبت · منذ دقيقتين",
          "green",
        ],
        [
          CircleDollarSign,
          "دفعة جديدة بقيمة 450 ج.م",
          "اشتراك عمر أحمد · منذ 12 دقيقة",
          "blue",
        ],
        [
          PenLine,
          "27 إجابة بانتظار التصحيح",
          "اختبار قوانين الحركة · منذ ساعة",
          "orange",
        ],
      ].map(([ItemIcon, title, meta, tone]) => {
        const NoticeIcon = ItemIcon as LucideIcon
        return (
          <button
            className="notification-item"
            key={String(title)}
            onClick={close}
          >
            <span className={`notice-icon ${tone}`}>
              <NoticeIcon size={18} />
            </span>
            <span>
              <b>{String(title)}</b>
              <small>{String(meta)}</small>
            </span>
            <i />
          </button>
        )
      })}
      <button className="all-notifications" onClick={close}>
        عرض كل الإشعارات
      </button>
    </aside>
  )
}

export default App
